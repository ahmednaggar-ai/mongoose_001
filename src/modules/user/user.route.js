import { Router } from "express";
import { getUsersList, getUserById, createUser, updateUser, deleteUser } from "./user.controller.js";

const router = Router();

router.get("/user", getUsersList);

router.get("/user/:id", getUserById);

router.post("/user", createUser);

router.patch("/user/:id", updateUser);

router.delete("/user/:id", deleteUser);



export default router;