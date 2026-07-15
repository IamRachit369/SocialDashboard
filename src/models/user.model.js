import mongoose, { trusted } from "mongoose"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import { useEffect } from "react"
  
const userSchema = new mongoose.Schema({
    username : {
        type : String, 
        required : true,
        unique : true,
        lowercase : true,
        index : true
    },
    email : {
        type : String, 
        required : true,
        unique : true,
        lowercase : true,
    },
    password : {
        type : String, 
        required : true,
    },
    name : {
        type : String, 
        required : true,
    },
    avatar : {
        type : String, 
    },
    coverImage : {
        type : String,
        required : true
    },
    watchHistory : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    }],
    refreshToken : {
        type : String
    }
}, {timestamps : true})

userSchema.pre("save", async function(error, req, res, next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 8)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)