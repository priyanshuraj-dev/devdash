import {Request,Response} from "express";
import { uploadOnCloudinary } from "../../config/cloudinary.js";

export const uploadImages = async(req:Request,res:Response) => {
    try {
        const files = req.files as Express.Multer.File[]
        if(!files || files.length === 0 || files.length as number > 5) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }
        const uploadPromises = files.map((file) =>
            // this buffer contains the raw binary bytes of image
            // this is what cloudinary needs when we upload via stream
            // buffer is always required when using memoryStorage
            uploadOnCloudinary(file.buffer)
        )

        const results = await Promise.all(uploadPromises);
        return res.status(200).json({
            message: "Upload successful",
            files: results.map((r)=>({
                url:r.secure_url,
                publicId: r.public_id
            }))
        })

    } catch (error) {
        return res.status(500).json({
            message: "Image upload failed"
        })
    }
}