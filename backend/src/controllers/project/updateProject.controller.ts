import {Request,Response} from "express";
import Project from "../../models/project.models.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

export const updateProject = async(req:Request,res: Response) => {
    try {
        const userId = (req as any).user._id;
        const {projectId} = req.params;
        console.log(projectId);
        const {
            title,
            description,
            techStack,
            images: newImages,
            githubLink,
            liveLink,
            featured,
            removedImageIds,
        } = req.body
        // console.log(removedImageIds);
        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).json({
                mesage: "Project not found"
            })
        }
        if(project.owner.toString() !== userId.toString()){
            return res.status(400).json({
                message: "Not authorised to update this project"
            })
        }

    //     if(Array.isArray(removedImageIds)){
    //         for(const publicId of removedImageIds){
                
    //             const result = await deleteFromCloudinary(publicId);
    //             console.log(`Deleted ${publicId}`,result)
    //         }
    //         $pull: {
    //         images: {
    //         publicId: { $in: removedImageIds }
    //         }
    // }
    //     }

    //     if (Array.isArray(newImages) && newImages.length > 0) {
    //         project?.images?.push(...newImages)
    //     }
        if(title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (techStack !== undefined) project.techStack = techStack;
        
        if (githubLink !== undefined) project.githubLink = githubLink;
        if (liveLink !== undefined) project.liveLink = liveLink;
        if (featured !== undefined) project.featured = featured;
        project.markModified('images')
        await project.save();
        console.log(project);
        return res.status(200).json({
            message: "Project updated successfully",
            project,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update project"
        })
    }
}