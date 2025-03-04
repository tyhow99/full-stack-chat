import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';


export const signup = async (req, res) => {
    const{fullName,email,password} = req.body;
    try {

        if (!fullName || !email || !password){
            return res.status(400).json({message: 'Please fill in all fields'});
        }
        //see if user exists
        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }
        const user = await User.findOne({email});
        if (user) return res.status(400).json({message: 'User already exists'});

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //adds a new user with the hashed password
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });

        if (newUser)
        {
            //res sends new cookie
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

        } else
        {
            return res.status(400).json({message: 'Error creating user'});
        }

    } catch (error) {

        console.error("Error in signup",error.message);
        res.status(500).json({message: 'Server error'});
    }
};


export const login = async(req, res) => {
    //check if all fields are filled
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "You left a field blank you sinner"});
    }
   try {
    //check if user exists
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: "What do you mean god is not real? You are not registered"});

    //check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({message: "You submitted bad credentials you sinner"});


    generateToken(user._id, res);
    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
    });
   } catch (error) {
    console.error("Error in login",error.message);
    res.status(500).json({message: "Server error"});
   }

};
// Logout user by clearing the JWT cookie
export const logout = (req, res) => {
    try {
        // Clear the JWT cookie by setting its maxAge to 0
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;

      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }

      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const checkAuth =  (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth", error.message);
        res.status(500).json({ message: "Server error" });
    }
}