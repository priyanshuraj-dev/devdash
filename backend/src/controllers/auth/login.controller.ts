import {Request,Response} from "express";
import bcrypt from "bcryptjs";
import User from "../../models/user.models.js"

export const login = async (req:Request,res:Response) => {
    try {
        const {identifier,password} = req.body;
        // console.log(identifier, password)
        if(!identifier || !password) {
            return res.status(400).json({
                message: "Identifier and password are required"
            })
        }
        const user = await User.findOne({
            $or:[{email:identifier},{username:identifier}]
        });
        if(!user){
            return res.status(401).json({
                message:"Invalid credentials"
            });
        }
        if(!user.isVerified){
            return res.status(401).json({
                message:"Please verify your email before logging in"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credentials"
            })
        };

        const accessToken =  user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        
        const options = {
            // this allow us to modify cookies only from the server
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",        // REQUIRED
            sameSite: "lax" as const,
        }
        return res
            .status(200)
            .cookie("accessToken",accessToken,{
                ...options,
                maxAge: 15*60*1000
            })
            .cookie("refreshToken",refreshToken,{
                maxAge: 7*24*60*60*1000
            })
            .json({
                message: "Login successful"
            })
    } catch (error) {
        console.error("Login error:",error);
        return res.status(500).json({message: "Internal server error"})
    }
}