import {Request,Response} from "express";
import jwt from "jsonwebtoken"
import User from "../../models/user.models.js"

interface JwtPayLoad {
    userId: string;
}
export const refreshAcessToken = async (req:Request,res:Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        // console.log("COOKIES RECEIVED:",req.cookies)
        if(!refreshToken){
            return res.status(401).json({
                message: "No refresh token present"
            })
        }
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET as string) as JwtPayLoad;
        const user = await User.findOne({
            _id: decoded.userId,
            refreshToken
        });
        if(!user){
            return res.status(403).json({
                message: "Invalid refresh token"
            })
        }
        const accessToken = user.generateAccessToken();
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const
        };
        return res
            .status(200)
            .cookie("accessToken",accessToken,{
                ...options,
                maxAge: 15*60*1000
            })
            .json({
                message: "Acess token refreshed"
            })
    } catch (error) {
        return res.status(400).json({
            message: "Refresh token expired or invalid"
        })
    }
}