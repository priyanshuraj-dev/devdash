import {Request,Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js"

interface JwtPayLoad{
    userId: string;
}

export const verifyJWT = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                message: "Unauthorised request"
            })
        }
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string) as JwtPayLoad;
        const user = await User.findById(decoded.userId).select("-password -refreshToken -verificationToken -verificationTokenExpiry");
        if(!user){
            return res.status(401).json({
                message: "Invalid access token"
            })
        }
        (req as any).user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        })
    }
}   