import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config()

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary and deletes the local copy.
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded on Cloudinary. File src: " + response.url);

    // Clean up local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response; // Postman will receive this object (includes public_id, url, secure_url, etc.)
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Clean up local file even if the upload fails
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

/**
 * Deletes an asset from Cloudinary using its Public ID.
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    // Destroy the asset on Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from Cloudinary. Public ID:", publicId);

    return result; // Crucial for Postman to see { result: 'ok' } or { result: 'not found' }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
