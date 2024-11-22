import express from "express";
import { createUser, loginUser, logOutCurrentUser, getCurrentUserProfile, updateCurrentUserProfile } from "../controller/user.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";
import { getAllUsers } from "../controller/admin.controller.js";
const router = express.Router()

router.route('/').post(createUser).get(authenticate, authorizeAdmin, getAllUsers)
router.post('/auth', loginUser)
router.post('/logout', logOutCurrentUser)
router.route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile)

export default router;