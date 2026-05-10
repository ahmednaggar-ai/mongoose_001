import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone :{
        type: String,
    }
},{
    timestamps: true,
    strict: "throw",
})
export const userModel = mongoose.model("user", userSchema);