import asyncHandler from "../middleware/async.handler.js";
import User from "../model/user.model.js";

const createUser = asyncHandler(async (req, res) =>{
    const { username, email, password } = req.body;

    // console.log(username, email, password);
    if(!User || !email || !password) {
        throw new Error("wrong credential");
    }

    const userExists = await User.findOne({email});
    if(userExists) res.status(400).send('User already exists');

    const newUser = await  new User({username, email, password})


    try{
        await newUser.save()

        res.status(201).json({_id:newUser._id, username: newUser.username, email: newUser.email})
    }catch(err) {
        console.log(err)
        res.status(400)
        throw new Error("Invalid credentials")
    } 

    res.send('OKKK')

})

export {createUser}