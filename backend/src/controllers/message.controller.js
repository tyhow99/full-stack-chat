import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import {v2 as cloudinary} from 'cloudinary';

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        //find all users except the logged in user
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId } }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar", error.message);
        res.status(500).json({ message: "Server error" });
    }

};

export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        //myId is the current user
        const myId = req.user._id;

        //find all messages where either user is the sender
        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

//can be a text or image
export const sendMessage = async (req,res) => {
    try {
        const {text, image} = req.body;
        //rename id as receiver id
        const {id: receiverId} = req.param;

        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save();

        //todo add real time functionality

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller", error.message)
    }
};