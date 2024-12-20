import asyncHandler from "../middleware/async.handler.js";
import User from "../model/user.model.js";
import bcrypt from 'bcrypt'
import generatedToken from "../utils/token.js";


const createUser = asyncHandler(async (req, res) =>{
    const { username, email, password } = req.body;

    // console.log(username, email, password);
    if(!User || !email || !password) {
        throw new Error("wrong credential");
    }

    const userExists = await User.findOne({email});
    if(userExists) res.status(400).send('User already exists');

    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await  new User({username, email, password:hashedPassword})


    try{
        await newUser.save()
        generatedToken(res, newUser._id)

        res.status(201).json({_id:newUser._id, username: newUser.username, email: newUser.email})
    }catch(err) {
        console.log(err)
        res.status(400)
        throw new Error("Invalid credentials")
    } 

    res.send('OKKK')

})

const loginUser = asyncHandler(async( req, res ) => {
    console.log('--->>>>>>>>>>>>>>>>>>>>>',req.body)
    const { email, password } = req.body;

    const findtheUser = await User.findOne({email});
    console.log(findtheUser)

    if(findtheUser) {
        const isValidPass = await bcrypt.compare(password, findtheUser.password)
         console.log('😎😎😎😎',isValidPass)
        if(isValidPass) {
            generatedToken(res, findtheUser._id)
            res.status(201).json({_id:findtheUser._id, username: findtheUser.username, email: findtheUser.email, isAdmin: findtheUser.isAdmin})
            return 
        }
    }
    res.status(500)
    throw new Error('Internal Server Error');

})

const logOutCurrentUser = asyncHandler(async(req, res) => {
    res.cookie("jwt","", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" })
})

const getCurrentUserProfile = asyncHandler( async( req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    }else {
        res.status(404)
        throw new Error("User Not Found");
    }
})

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
  
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
      }
  
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

export {createUser, loginUser, logOutCurrentUser,getCurrentUserProfile, updateCurrentUserProfile}