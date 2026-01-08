import {v2 as cloudinary} from "cloudinary";
import streamifier from "streamifier"
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


export const uploadOnCloudinary = (buffer:Buffer,folder="portfolio") : Promise<{secure_url:string;public_id:string;}> => {
    return new Promise((resolve,reject) => {
        // this stream is used bcz we don't want to store the entire file on disk 
        // process data as it flows, not after it's fully loaded
        const uploadStream = cloudinary.uploader.upload_stream(
            {folder},
            (error,result)=>{
                if(error) return reject(error);
                if(!result) return reject(new Error("Cloudinary upload failed"));

                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id
                })
        });
        // cloudinary expects a stream so we convert buffer to stream
        streamifier.createReadStream(buffer).pipe(uploadStream);
    })
}

export const deleteFromCloudinary = async(publicId: string) => {
try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
} catch (error) {
    console.error("Cloudinary Destroy error: ",error);
    throw error
}}