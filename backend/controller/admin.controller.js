import asyncHandler from "../middleware/async.handler.js";
import User from "../model/user.model.js";

const getAllUsers = asyncHandler(async( req, res) => {
    console.log('hit')
    const users = await User.find({})
    res.json(users)
})

const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
  
    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Cannot delete admin user");
      }
  
      await User.deleteOne({ _id: user._id });
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
  });

  const getUserById = asyncHandler(async( req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        if(user.isAdmin) {
            res.status(400)
            throw new Error("Invalid credentails")
        }
        res.status(200)
        res.send(user);
    }
    else {
        res.status(404)
        throw new Error("User not found")
    }
  })
  
  const updateUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })

export { getAllUsers, deleteUserById, getUserById, updateUserById }