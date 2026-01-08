import {Request,Response} from "express";
import bcrypt from "bcryptjs";
import User from "../../models/user.models.js"

export const resetPassword = async(req:Request,res:Response) => {
    try {
        const {token,newPassword} = req.body;
        console.log(token, newPassword)
        if(!token || !newPassword){
            return res.status(400).json({
                message: "Token and new password are required"
            });
        }
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: {$gt: new Date()}
        })
        if(!user){
            return res.status(400).json({
                message: "Invalid or expired reset token"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword,12);
        user.password = hashedPassword;
        user.resetPasswordExpiry = undefined;
        user.resetPasswordToken = undefined;
        user.refreshToken = undefined;

        await user.save();
        return res.status(200).json({
            message: "Password reset successfully. Please login again"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}