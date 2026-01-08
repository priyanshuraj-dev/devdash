import { Request,Response } from "express";
import crypto from "crypto";
import User from "../../models/user.models.js"
import transporter from "../../config/mailer.js";

export const forgotPassword = async(req:Request,res:Response) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                message: "Email is required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(200).json({
                message: "If an account exists,a reset email has been sent"
            })
        }
        // this is to prevent spam emails being sent again and again for password reset on same mail 
        // also called cooldown window
        if(user.resetPasswordRequestedAt && Date.now()-user.resetPasswordRequestedAt?.getTime() < 5*60*1000){
            return res.status(200).json({
                message: "If an account exists , a reset email has been sent"
            })
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = new Date(Date.now()+10*60*1000);
        user.resetPasswordRequestedAt = new Date();
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            to: user.email,
            subject: "Reset your password",
            html: `
              <p>Click the link below to reset your password:</p>
              <a href="${resetLink}">Reset Password</a>
              <p>This link expires in 10 minutes.</p>
            `
        })
        return res.status(200).json({
            message: "If an account exists, a reset email has been sent"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}