import { uploadToCloudinary } from "./cloudinary";

interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const handleFileUpload = async (
  file: File,
  options: {
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
    validateFile?: (file: File) => boolean;
  } = {}
): Promise<FileUploadResult> => {
  const { onUploadStart, onUploadEnd, validateFile } = options;

  if (!file) {
    return { success: false, error: "No file selected" };
  }

  // Optional custom file validation
  if (validateFile && !validateFile(file)) {
    return { success: false, error: "Invalid file" };
  }

  try {
    // Optional callback for upload start
    onUploadStart?.();

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(file);

    // Optional callback for upload end
    onUploadEnd?.();

    return {
      success: true,
      url: cloudinaryUrl,
    };
  } catch (error) {
    console.error("Upload failed", error);

    // Optional callback for upload end
    onUploadEnd?.();

    return {
      success: false,
      error: "Failed to upload file",
    };
  }
};

// Example validators you could use
export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  return allowedTypes.includes(file.type) && file.size < 5 * 1024 * 1024; // 5MB limit
};

export const validatePdfFile = (file: File): boolean => {
  const allowedTypes = ["application/pdf"];
  return allowedTypes.includes(file.type) && file.size < 10 * 1024 * 1024; // 10MB limit
};
