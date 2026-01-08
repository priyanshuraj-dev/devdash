import {Request,Response} from "express";
import User from "../../models/user.models.js";
import Project from "../../models/project.models.js"

export const getPublicPortfolio = async(req:Request,res:Response) => {
    try {
        const {username} = req.params;
        if(!username){
            return res.status(400).json({
                message:"Username is required"
            })
        }
        const user = await User.findOne({username}).select(
            "username email avatar leetcodeHandle codeforcesHandle codechefHandle githubHandle"
        );
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const projects = await Project.find({owner: user._id}).sort({featured: -1,createdAt: -1}).select("-__v");
        return res.status(200).json({
            user,
            projects,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch portfolio"
        })
    }
}