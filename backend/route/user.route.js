import express from "express";
import { createUser, loginUser, logOutCurrentUser, getCurrentUserProfile, updateCurrentUserProfile } from "../controller/user.controller.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware.js";
import { deleteUserById, getAllUsers, getUserById, updateUserById } from "../controller/admin.controller.js";
const router = express.Router()

router.route('/').post(createUser).get(authenticate, authorizeAdmin, getAllUsers)
router.post('/auth', loginUser)
router.post('/logout', logOutCurrentUser)
router.route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile)


// Admin Route
router.route('/:id')
.delete(authenticate, authorizeAdmin, deleteUserById)    
.get(authenticate, authorizeAdmin, getUserById)
.put(authenticate, authorizeAdmin, updateUserById);
export default router;