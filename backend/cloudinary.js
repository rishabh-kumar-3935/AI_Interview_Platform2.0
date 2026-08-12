import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto",
            }
        );

        console.log(
            "File is uploaded on Cloudinary:",
            response.secure_url
        );

        return response;

    } catch (error) {
        console.error(
            "Cloudinary upload failed:",
            error?.message || error
        );

        return null;
    } finally {
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (cleanupError) {
            console.warn(
                "Unable to remove local temp file:",
                cleanupError?.message || cleanupError
            );
        }
    }
};
const deleteFromCloudinary = async (
    publicId,
    resourceType = "image"
) => {

    if (!publicId) {
        return null;
    }

    try {

        const response =
            await cloudinary.uploader.destroy(
                publicId,
                {
                    resource_type: resourceType,
                }
            );

        console.log(
            `Cloudinary delete result for ${publicId}:`,
            response
        );

        return response;

    } catch (error) {

        console.error(
            "Cloudinary deletion failed:",
            error?.message || error
        );

        return null;
    }
};

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
};