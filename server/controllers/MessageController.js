import getPrismaInstance from '../utils/PrismaClient.js'
import { renameSync } from 'fs'
export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance()
    const { message, from, to } = req.body
    console.log({ message, from, to })
    const getUser = onlineUsers.get(to)
    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: { connect: { id: parseInt(from) } },
          reciever: { connect: { id: parseInt(to) } },
          messageStatus: getUser ? 'delivered' : 'sent',
        },
        include: { sender: true, reciever: true },
      })
      return res.status(201).send({ message: newMessage })
    }
    return res.status(400).send('from, to and message are required')
  } catch (error) {
    next(error)
  }
}

export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance()
    const { from, to } = req.params
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(from),
            recieverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            recieverId: parseInt(from),
          },
        ],
      },
      orderBy: { id: 'asc' },
      // include: { sender: true, reciever: true },
    })
    const unreadMessages = []
    messages.forEach((message, index) => {
      // console.log("foreach", {to, from, message})
      if (
        message.messageStatus !== 'read' &&
        message.senderId === parseInt(to)
      ) {
        //confirmar si se cambia de "to" a "from"
        messages[index].messageStatus = 'read'
        unreadMessages.push(message.id)
      }
    })
    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: 'read',
      },
    })
    res.status(200).json({ messages })
  } catch (error) {
    next(error)
  }
}

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now()
      let fileName = 'uploads/images/' + date + req.file.originalname
      console.log({fileName})
      renameSync(req.file.path, fileName)
      const prisma = getPrismaInstance()
      const { from, to } = req.query
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            reciever: { connect: { id: parseInt(to) } },
            type: 'image',
          },
        })
        console.log({message})
        return res.status(201).json({ message })
      }
      return res.status(400).send('from and to are required.')
    }
    return res.status(400).send('image is required.')
  } catch (error) {
    next(error)
  }
}
