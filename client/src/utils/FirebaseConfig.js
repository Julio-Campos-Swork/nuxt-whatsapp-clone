import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAf0l6h2U9gx6IMb9Gmx3fBmHVmJMcvOho',
  authDomain: 'whatsapp-clone-b32bf.firebaseapp.com',
  projectId: 'whatsapp-clone-b32bf',
  storageBucket: 'whatsapp-clone-b32bf.appspot.com',
  messagingSenderId: '1092880600697',
  appId: '1:1092880600697:web:db93a9145d7c6d1e154ea8',
  measurementId: 'G-D4ZVQZ12Z1',
}

const app = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(app)
