import User from "../models/user.model.js";

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
        const loggedInUserId = req.user._id;

        //find all messages between logged in user and the user with id
        const messages = await Message.find({
            $or: [
                { sender: loggedInUserId, receiver: id },
                { sender: id, receiver: loggedInUserId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages", error.message);
        res.status(500).json({ message: "Server error" });
    }
};