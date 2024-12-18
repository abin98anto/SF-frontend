import React, { useRef } from "react";
import { imageLinks } from "../../../utils/constants";

interface FileUploadButtonProps {
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  isUploading: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  handleFileChange,
  isUploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/jpeg,image/png,image/gif"
      />
      <button
        className="button"
        onClick={triggerFileInput}
        type="button"
        disabled={isUploading}
      >
        <svg xmlns={imageLinks.GOOGLE_SVG}>
          <rect className="border" pathLength={100} />
          <rect className="loading" pathLength={100} />
          <svg
            className="done-svg"
            xmlns={imageLinks.GOOGLE_SVG}
            viewBox="0 0 24 24"
          >
            <path
              className="done done-cloud"
              pathLength={100}
              d={imageLinks.D_CLOUD}
            />
            <path
              className="done done-check"
              pathLength={100}
              d={imageLinks.D_CHECK}
            />
          </svg>
        </svg>
        <div className="txt-upload">
          {isUploading ? "Uploading..." : "Upload"}
        </div>
      </button>
    </>
  );
};

export default FileUploadButton;
