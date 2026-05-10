import { Router } from "express";
import { createPost, deletePost, getPostById, getPostsList, updatePost } from "./post.controller.js";

const router = Router();

router.get("/post", getPostsList);

router.get("/post/:id", getPostById);

router.post("/post", createPost);

router.patch("/post/:id", updatePost);

router.delete("/post/:id", deletePost);


export default router;