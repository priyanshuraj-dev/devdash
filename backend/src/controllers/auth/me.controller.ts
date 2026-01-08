import {Request,Response} from "express";

export const getMe = async(req:Request,res:Response) => {
    try {
        const user = (req as any).user;
        if(!user){
            return res.status(401).json({
                message: "Unauthorised request"
            })
        }
        return res.status(200).json({
            user: {
                id: user._id,
                username:user.username,
                email:user.email,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                avatar: user.avatar,
                codeforcesHandle: user.codeforcesHandle,
                codechefHandle: user.codechefHandle,
                githubHandle: user.githubHandle,
                leetcodeHandle: user.leetcodeHandle
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}