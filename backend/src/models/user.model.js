import mongoose from "mongoose";


//creating a user with mongoose schema
const userSchema = new mongoose.Schema(
   {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: "",
    },

   },
   {timestamps: true}
);

//mongodb auto updates database to be "users"
const User = mongoose.model("User", userSchema);

export default User;