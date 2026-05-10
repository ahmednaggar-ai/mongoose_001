import express from "express";

export const bootstrap = ()=>{

    const app = express();
    app.use(express.json());

    app.use("/getHealthApp", (req, res)=>{
        res.send("Server is running");
    });

    app.listen(3000, ()=>{
        console.log("Server is running on http://localhost:3000");
    });
}