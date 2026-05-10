import mongoose from "mongoose";
import { env } from "../../config/env.service.js";



export const databaseConnection = ()=>{
    mongoose.connect(env.mongodbUrl).then(()=>{
        console.log("Connected to MongoDB");
    }).catch((err)=>{
        console.log(err);
    })
}
