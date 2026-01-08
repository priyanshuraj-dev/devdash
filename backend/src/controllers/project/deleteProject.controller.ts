import {Request,Response} from "express";
import Project from "../../models/project.models.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

export const deleteProject = async (req:Request,res:Response) => {
    try {
        const userId = (req as any).user._id;
        const {projectId} = req.params;
        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).json({
                message: "Project not found"
            })
        }
        if(project.owner.toString() !== userId.toString()){
            return res.status(403).json({
                message: "Not authorised to delete this project"
            })
        }
        if(project.images && project.images.length > 0){
            for(const image of project.images){
                await deleteFromCloudinary(image.publicId)
            }
        }
        await project.deleteOne();
        return res.status(200).json({
            message: "Project deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete project"
        })
    }
}