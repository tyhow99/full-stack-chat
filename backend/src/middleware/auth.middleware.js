import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        //because we call it res.cookie("jwt")
        const token = req.cookies.jwt

        if (!token) return res.status(401).json({message: 'Unauthorized - you provided nothing you sinner'});

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: 'Unauthorized - you sinner'});
        }

        //find user by id then select all fields except password
        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(401).json({message: 'No user found - you sinner'});
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("Error in protectRoute", error.message);
        res.status(500).json({ message: "Server error" });
    }
}