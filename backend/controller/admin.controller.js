import asyncHandler from "../middleware/async.handler.js";
import User from "../model/user.model.js";

const getAllUsers = asyncHandler(async( req, res) => {
    console.log('hit')
    const users = await User.find({})
    res.json(users)
})

export { getAllUsers}