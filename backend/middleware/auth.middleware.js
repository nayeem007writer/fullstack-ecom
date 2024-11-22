import jwt from "jsonwebtoken";
import asyncHandler from "./async.handler.js";
import User from "../model/user.model.js";

const authenticate = asyncHandler(async(req, res, next) =>{
    let token;
    token = req.cookies.jwt;
    // console.log(token)
    if(token) {
        try{
            const decodedToken = jwt.verify(token, "DSFUHW8534NFV")
            console.log('++++++++++++++++>>>>>>>>>>',decodedToken)
            const {userId} = decodedToken
            req.user = await User.findById(userId).select('-password')
            console.log(req.user)
            next()


        } catch(err) {
            res.status(401)
            throw new Error("Unauthorised")
        }
    }
    else {
        res.status(401)
        throw new Error("Invalid credentials")
    }
})

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).send("Not authorized as an admin.");
    }
  };

export {
    authenticate,
    authorizeAdmin,
}