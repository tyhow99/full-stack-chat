import jwt from 'jsonwebtoken';

//creates a token that expires in 7 days
export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    //after 7 day user needs to login again
    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        httpOnly: true,//prevents xss cross site scripting
        sameSite: 'strict',//prevents csrf cross site request forgery
        secure: process.env.NODE_ENV !== "development"//
    })

    return token;
}
