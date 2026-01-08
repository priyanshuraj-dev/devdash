import {Request,Response} from "express";
import Project from "../../models/project.models.js"
import User from "../../models/user.models.js";
export const createProject = async(req:Request,res:Response) => {
    try {
        const userId = (req as any).user._id;
        const {
            title,
            description,
            techStack,
            images,
            githubLink,
            liveLink,
            featured,
        } = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.status(401).json({
                message: "Unauthorised  request"
            })
        }
        if(!title || !description || !techStack){
            return res.status(400).json({
                message: "Missing required fields",
            })
        }
        const project = await Project.create({
            title,
            description,
            techStack,
            images,
            githubLink,
            liveLink,
            featured,
            owner:userId,
        });
        return res.status(201).json({
            message: "Project created successfully",
            project
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create project"
        })
    }
}