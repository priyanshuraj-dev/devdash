import {Request,Response} from "express";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

export const deleteImage = async(req:Request,res:Response) => {
    try {
        const {publicId} = req.body;
        if(!publicId){
            return res.status(400).json({
                message: "publicId is required"
            })
        }
        await deleteFromCloudinary(publicId);
        return res.status(200).json({
            message: "Image deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Image deletion failed"
        })
    }
}