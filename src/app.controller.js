import express from "express";
import mongoose from "mongoose";
import { env } from "../config/env.service.js";
import { databaseConnection } from "./database/connection.js";
import userRoute from "./modules/user/user.route.js"
import postRoute from "./modules/post/post.route.js"

export const bootstrap = ()=>{

    const app = express();
    app.use(express.json());

    app.use("/getHealthApp", (req, res)=>{
        res.send("Server is running");
    });
    databaseConnection();

    app.use("/api", userRoute)
    app.use("/api", postRoute)

    app.use((err, req, res, next) => {
        if (err instanceof mongoose.Error.StrictModeError) {
            return res.status(400).json({
                success: false,
                message: err.message,
                invalidField: err.path,
            });
        }
        next(err);
    });

    app.listen(env.port, ()=>{
        console.log(`Server is running on http://localhost:${env.port}`);
    });
}