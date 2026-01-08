import {Request,Response} from "express"
import User from "../../models/user.models.js";


export const logout = async(req:Request,res:Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if(refreshToken){
            await User.findOneAndUpdate({refreshToken},{
                $set: {refreshToken:undefined}
            })
        }
        const options = {
            // to prevent access from document.cookie in frontend
            httpOnly: true,
            //  if secure true then only cookie be sent when link is in https and in localhost it never hapen so it should be no for local host otherwise yes
            secure: process.env.NODE_ENV === "production",
            
            sameSite: "lax" as const
        }
        return res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json({
                message: "Logged out successfully"
            })
    } catch (error) {
        console.error("Logout error:",error);
        return res.status(500).json({
            message: "Intenal server error"
        })
    }
}