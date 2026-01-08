import {Request,Response} from "express";
import bcrypt from "bcryptjs";
import User from "../../models/user.models.js";
import crypto from 'crypto';
import transporter from "../../config/mailer.js";
export const signup = async(req:Request,res:Response) => {
    try {
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                message: "Username, email and password all are required"
            })
        }
        const existingUser = await User.findOne({
            $or: [{email},{username}]
        });
        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password,12);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex")
        await User.create({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken: hashedToken,
            verificationTokenExpiry: new Date(Date.now()+10*60*1000)
        })

        const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

        await transporter.sendMail({
            from: `"Portfolio App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            html: `
                <h3>Email Verification</h3>
                <p>Click the link below to verify your account:</p>
                <a href="${verifyLink}">Verify Email</a>
                <p>This link expires in 10 minutes.</p>
            `
        })
        return res.status(201).json({
            message: "Signup successful.Verification email sent"
        })
    } catch (error) {
        console.error("Signup error:",error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}