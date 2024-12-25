import React, { useState } from "react";
import { ImageIcon, Upload as UploadIcon } from "lucide-react";
import type { AdvanceInfo } from "../form-types";
import {
  FormSection,
  InputGroup,
  ButtonGroup,
  Button,
  UploadSection,
  UploadText,
  UploadButton,
} from "../StyledComponents";
import {
  handleFileUpload,
  validateImageFile,
} from "../../../../../utils/fileUpload";

interface AdvanceInformationProps {
  data: AdvanceInfo;
  onUpdate: (data: Partial<AdvanceInfo>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  setError: (error: string) => void;
}

export function AdvanceInformation({
  data,
  onUpdate,
  onNext,
  onPrevious,
  onCancel,
  setError,
}: AdvanceInformationProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await handleFileUpload(file, {
        validateFile: validateImageFile,
        onUploadStart: () => setIsUploading(true),
        onUploadEnd: () => setIsUploading(false),
      });

      if (result.success && result.url) {
        onUpdate({
          thumbnail: result.url,
        });
      } else {
        setError(result.error || "Failed to upload image");
      }
    } catch (error) {
      setError("An error occurred while uploading the image");
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    if (!data.thumbnail) {
      setError("Thumbnail is required");
      return false;
    }
    if (!data.description.trim()) {
      setError("Description is required");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <FormSection>
      <h2>Advance Information</h2>

      <UploadSection>
        <UploadIcon>
          <ImageIcon size={48} />
        </UploadIcon>
        <UploadText>
          {isUploading
            ? "Uploading..."
            : data.thumbnail
            ? "Image uploaded successfully"
            : "Upload your course thumbnail"}
        </UploadText>
        {/* <UploadButton disabled={isUploading}> */}
        <UploadButton>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            style={{ display: "none" }}
          />
          <UploadIcon />
          {isUploading ? "Uploading..." : "Upload"}
        </UploadButton>
      </UploadSection>

      <InputGroup>
        <label htmlFor="description">Course Description</label>
        <textarea
          id="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Provide a detailed description of your course"
          rows={6}
        />
      </InputGroup>

      <ButtonGroup>
        <div>
          <Button onClick={onCancel} style={{ marginRight: "1rem" }}>
            Cancel
          </Button>
          <Button onClick={onPrevious}>Back</Button>
        </div>
        <Button onClick={handleNext} disabled={isUploading}>
          Save & Next
        </Button>
      </ButtonGroup>
    </FormSection>
  );
}
