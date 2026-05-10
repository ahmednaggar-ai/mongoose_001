import { postModel } from "../../models/post.model.js";


const retrievePosts = async () =>{
    const posts = await postModel.find({}, {__v:0}).populate("userId", {__v:0, password:0})
    if(posts.length > 0){
        return {
            success: true,
            message: "Posts fetched successfully",
            data: posts,
        }
    }
    return {
        success: false,
        message: "No posts found",
        data: [],
    }
}

const retrievePostById = async (id) =>{
    const post = await postModel.findById(id, {__v:0}).populate("userId", {__v:0, password:0})
    if(post){
        return {
            success: true,
            message: "Post fetched successfully",
            data: post,
        }
    }
    return {
        success: false,
        message: "Post not found",
        data: null,
    }
}

const addPost = async (postData) =>{
    let post = await postModel.create(postData)
    if(post){
        return {
            success: true,
            message: "Post created successfully",
            data: post,
        }
    }
    return {
        success: false,
        message: "Post not created",
        data: null,
    }
}

const existPostByContent = async (content) => {
    const post = await postModel.findOne({content: content});
    return post ? true : false;
}


const deletePostById = async (id, userId) => {
    const deleted = await postModel.findOneAndDelete({
        _id: id,
        userId: userId,
    });
    if (deleted) {
        return {
            success: true,
            message: "Post deleted successfully",
            data: deleted.id,
        };
    }
    const post = await postModel.findById(id);
    if (!post) {
        return {
            success: false,
            message: "Post not found",
            data: null,
        };
    }
    return {
        success: false,
        message: "You can only delete your own posts",
        data: null,
    };
};

const updatePostById = async (id, userId, updates) => {
    const post = await postModel.findById(id);
    if (!post) {
        return {
            success: false,
            message: "Post not found",
            data: null,
        };
    }
    if (post.userId.toString() !== userId) {
        return {
            success: false,
            message: "You can only update your own posts",
            data: null,
        };
    }
    const { title, content } = updates;
    const payload = {};
    if (title !== undefined) payload.title = title;
    if (content !== undefined) {
        if (content !== post.content) {
            const taken = await postModel.findOne({
                content,
                _id: { $ne: id },
            });
            if (taken) {
                return {
                    success: false,
                    message: "Post content already exists",
                    data: null,
                };
            }
        }
        payload.content = content;
    }
    if (Object.keys(payload).length === 0) {
        return {
            success: false,
            message: "No fields to update",
            data: null,
        };
    }
    const updated = await postModel
        .findByIdAndUpdate(id, payload, { new: true, runValidators: true })
        .select({ __v: 0 })
        .populate("userId", { __v: 0, password: 0 });
    return {
        success: true,
        message: "Post updated successfully",
        data: updated,
    };
};

export {retrievePosts, retrievePostById, addPost, existPostByContent, deletePostById, updatePostById}