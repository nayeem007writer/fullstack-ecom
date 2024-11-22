import express from "express";
import { createUser, loginUser } from "../controller/user.controller.js";

const router = express.Router()

router.route('/').post(createUser)
router.post('/auth', loginUser)

export default router;