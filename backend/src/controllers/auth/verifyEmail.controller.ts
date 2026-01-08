import {Request,Response} from "express";
import User from "../../models/user.models.js"
import crypto from "crypto"
export const verifyEmail = async(req:Request,res: Response) => {
    try {
        const {token} = req.query;
        if(!token){
            return res.status(400).json({
                message: "Verification token is required"
            })
        }
        const hashedToken = crypto.createHash("sha256").update(token as string).digest("hex")
        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpiry: {$gt: new Date()}
        });

        if(!user){
            return res.status(400).json({
                message: "Invalid or expired verification token"
            })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully"
        })
    } catch (error) {
        console.error("Verify email error:",error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}