import { existUserById, normalizeUserIdForDb } from "../user/user.service.js";
import { addPost, deletePostById, existPostByContent, retrievePostById, retrievePosts, updatePostById } from "./post.service.js";

const getPostsList = async (req, res) => {
    const response = await retrievePosts();
    res.status(response.success ? 200 : 400).json(response);
}

const getPostById = async (req, res) => {
    let {id} = req.params;
    const response = await retrievePostById(id);
    res.status(response.success ? 200 : 400).json(response);
}

const createPost = async (req, res) => {
    let {title, content, userId} = req.body;
    userId = normalizeUserIdForDb(userId);
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing user id",
        })
    }
    const exitPost = await existPostByContent(content);
    if(exitPost){
        return res.status(400).json({
            success: false,
            message: "Post content already exists",
        })
    }
    const existUser = await existUserById(userId);
    if(!existUser){
        return res.status(400).json({
            success: false,
            message: "User not found",
        })
    }
    const postData = {
        title,
        content,
        userId,
    }
    const response = await addPost(postData);
    res.status(response.success ? 200 : 400).json(response);
}

const updatePost = async (req, res) => {
    let { id } = req.params;
    let { title, content, userId } = req.body;
    userId = normalizeUserIdForDb(userId);
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing user id",
        });
    }
    const existUser = await existUserById(userId);
    if (!existUser) {
        return res.status(400).json({
            success: false,
            message: "User not found",
        });
    }
    const response = await updatePostById(id, userId, { title, content });
    res.status(response.success ? 200 : 400).json(response);
};

const deletePost = async (req, res) => {
    let {id} = req.params;
    let userId = normalizeUserIdForDb(req.body.userId);
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing user id",
        })
    }
    const existUser = await existUserById(userId);
    if(!existUser){
        return res.status(400).json({
            success: false,
            message: "User not found",
        })
    }
    const response = await deletePostById(id, userId);
    res.status(response.success ? 200 : 400).json(response);
}

export {getPostsList, getPostById, createPost, updatePost, deletePost}