import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
        unique: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
},{
    timestamps: true,
    strict: "throw",
})

export const postModel = mongoose.model("post", postSchema);