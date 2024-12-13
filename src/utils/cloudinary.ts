import axios from "axios";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  // Create a FormData object
  console.log("first");
  const formData = new FormData();

  // Add file to FormData
  formData.append("file", file);

  // Add upload preset and cloud name
  // Note: These should be set in your environment variables
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ""
  );
  formData.append(
    "cloud_name",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ""
  );

  try {
    // Make the upload request to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Return the secure URL of the uploaded image
    console.log("image uploaded!");
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};
