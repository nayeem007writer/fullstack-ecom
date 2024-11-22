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
    const { email, password } = req.body;

    const findtheUser = await User.findOne({email});

    if(findtheUser) {
        const isValidPass = await bcrypt.compare(password, findtheUser.password)

        if(isValidPass) {
            generatedToken(res, findtheUser._id)
            res.status(201).json({_id:findtheUser._id, username: findtheUser.username, email: findtheUser.email})
            return 
        }
    }
    res.status(500)
    throw new Error('Internal Server Error');

})

export {createUser, loginUser}