import express from "express";
import { createUser } from "../controller/user.controller.js";

const router = express.Router()

router.route('/').post(createUser)

export default router;