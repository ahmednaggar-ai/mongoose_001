import mongoose from "mongoose";
import { userModel } from "../../models/user.model.js"

/** Accepts a plain ObjectId string or a full URL whose last segment is the id (avoids CastError on pasted links). */
function extractObjectIdString(value) {
    if (value == null || value === "") return null;
    const s = String(value).trim();
    const match = s.match(/([a-f\d]{24})$/i);
    return match ? match[1] : s;
}

/** Valid MongoDB ObjectId string, or null if missing/invalid. */
export function normalizeUserIdForDb(value) {
    const normalized = extractObjectIdString(value);
    if (!normalized || !mongoose.Types.ObjectId.isValid(normalized)) {
        return null;
    }
    return normalized;
}

const blockedFields = {
    password:0,
    __v:0
}
const retrieveUsers = async () =>{
    const users = await userModel.find({}, blockedFields);
    if(users.length > 0){
        return {
            success: true,
            message: "Users list fetched successfully",
            data: users,
        }
    }
    return {
        success: false,
        message: "No users found",
        data: [],
    }
}
const retreiveUserById = async (id) =>{
    const user = await userModel.findById(id, blockedFields);
    if(user){
        return {
            success: true,
            message: "User fetched successfully",
            data: user,
        }
    }
    return {
        success: false,
        message: "User not found",
        data: null,
    }
}

const addUser = async (userData) =>{
    let user = await userModel.create(userData);
    if(user){
        return{
            success: true,
            message: "User created successfully",
            data: user = {
                id: user._id,
                userName: user.userName,
                email: user.email,
                phone: user.phone,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        }
    }
    return {
        success: false,
        message: "User not created",
        data: null,
    }
}

const existsUser = async (userEmail) => {
    const user = await userModel.findOne({email:userEmail});
    return user ? true : false;
}
const existUserById = async (id) => {
    const normalized = normalizeUserIdForDb(id);
    if (!normalized) {
        return false;
    }
    const user = await userModel.findById(normalized, blockedFields);
    return user ? true : false;
}

const changeUserData = async (id, userData) =>{
    let updatedUser = await userModel.findByIdAndUpdate(id, userData, {new: true, blockedFields});
    if(updatedUser){
        return {
            success: true,
            message: "User data updated successfully",
            data: updatedUser = {
                id: updatedUser._id,
                userName: updatedUser.userName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            },
        }
    }
    return {
        success: false,
        message: "User not found",
        data: null,
    }
}

const removeUser = async (id) =>{
    const deletedUser = await userModel.findByIdAndDelete(id);
    if(!deletedUser){
        return {
            success: false,
            message: "User not found",
            data: null,
        }
    }
    return {
        success: true,
        message: "User deleted successfully",
        data: deletedUser.id,
    }
} 


export {retrieveUsers, retreiveUserById, addUser, existsUser, removeUser, changeUserData, existUserById}