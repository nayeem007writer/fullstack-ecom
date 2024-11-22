import jwt from "jsonwebtoken";

const generatedToken = (res, userId) => {
    const token = jwt.sign({userId}, "DSFUHW8534NFV",{expiresIn: '30d'});
    
    //set 
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return token
}

export default generatedToken;