import { Router } from "express";
import { checkUser, getAllusers, onBoardUser } from "../controllers/AuthController.js";


const router = Router()

router.post("/check-user", checkUser )
router.post("/onboard-user", onBoardUser)
router.get("/get-contacts", getAllusers)
export default router