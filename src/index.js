import dotenv from 'dotenv'
import { app } from './app.js';
import mongoose from "mongoose";
import connectDB from "./db/index.js";

dotenv.config({
    path : './.env'
})

connectDB().then(
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Server connected")
    })
).catch((error)=>{console.log("MongoDB connection failed")})
