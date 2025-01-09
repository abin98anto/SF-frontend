import axios from "axios";
import { cloudinaryLinks, someMessages } from "./constants";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const response = await axios.post(cloudinaryLinks.CLOUDI_UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(someMessages.FILE_UPLOAD_SUCC);
    return response.data.secure_url;
  } catch (error) {
    console.error(someMessages.FILE_UPLOAD_FAIL, error);
    throw new Error(someMessages.FILE_UPLOAD_FAIL);
  }
};
