import express from "express";
import { env } from "../config/env.service.js";
import { databaseConnection } from "./database/connection.js";

export const bootstrap = ()=>{

    const app = express();
    app.use(express.json());

    app.use("/getHealthApp", (req, res)=>{
        res.send("Server is running");
    });
    databaseConnection();
    app.listen(env.port, ()=>{
        console.log(`Server is running on http://localhost:${env.port}`);
    });
}