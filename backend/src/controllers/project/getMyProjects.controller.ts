import {Request,Response} from "express"
import Project from "../../models/project.models.js"
export const getMyProjects = async (req:Request,res:Response) =>{
    try {
        const userId = (req as any).user._id;
        const projects = await Project.find({owner:userId}).sort({featured: -1,createdAt: -1}).select("-__v");
        return res.status(200).json({
            count: projects.length,
            projects
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch projects"
        })
    }
}