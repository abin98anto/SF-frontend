import axios from "axios";
import { cloudinaryLinks } from "./constants";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append(
      "cloud_name",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const response = await axios.post(cloudinaryLinks.CLOUDI_UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("image uploaded!");
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};
