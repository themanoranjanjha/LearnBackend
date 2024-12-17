import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

 const removePreviousAvatar = async (avatarUrl) => {
    if (!avatarUrl) {
        // console.log("No avatar URL provided. Skipping removal.");
        return;
    } 

    try {
        // Extract the public_id from the Cloudinary URL
        const publicId = avatarUrl.split('/').pop().split('.')[0];

        // Delete the avatar from Cloudinary
        await cloudinary.uploader.destroy(publicId);
        // console.log(`Successfully removed avatar: ${publicId}`);
    } catch (error) {
        console.error("Error while removing the previous avatar:", error.message);
        throw new Error("Failed to remove the previous avatar.");
    }
};
export { uploadOnCloudinary , removePreviousAvatar}