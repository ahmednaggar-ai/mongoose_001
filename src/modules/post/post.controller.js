import { postModel } from "../../models/post.model.js";
import { getUnknownSchemaKeys, unknownFieldsErrorPayload } from "../../utils/schema-body.js";
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
    const unknownKeys = getUnknownSchemaKeys(req.body, postModel.schema);
    if (unknownKeys.length > 0) {
        return res.status(400).json(unknownFieldsErrorPayload(unknownKeys));
    }
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
    const response = await addPost({ ...req.body, userId });
    res.status(response.success ? 200 : 400).json(response);
}

const updatePost = async (req, res) => {
    let { id } = req.params;
    const unknownKeys = getUnknownSchemaKeys(req.body, postModel.schema);
    if (unknownKeys.length > 0) {
        return res.status(400).json(unknownFieldsErrorPayload(unknownKeys));
    }
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
    const unknownKeys = getUnknownSchemaKeys(req.body, postModel.schema);
    if (unknownKeys.length > 0) {
        return res.status(400).json(unknownFieldsErrorPayload(unknownKeys));
    }
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