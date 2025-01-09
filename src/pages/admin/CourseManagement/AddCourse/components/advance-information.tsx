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
import { someMessages } from "../../../../../utils/constants";

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
        console.log(someMessages.IMG_UPLOAD_FAIL, result.error);
        setError(someMessages.IMG_UPLOAD_FAIL);
      }
    } catch (error) {
      setError(someMessages.IMG_UPLOAD_FAIL);
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    if (!data.thumbnail) {
      setError(someMessages.THUMBNAIL_REQ);
      return false;
    }
    if (!data.description.trim()) {
      setError(someMessages.DESCRIPTION_RQ);
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
            ? someMessages.UPLOADING
            : data.thumbnail
            ? someMessages.IMG_UPLOAD_SUCCESS
            : someMessages.THUMBNAIL_DEFAULT}
        </UploadText>
        <UploadButton>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            style={{ display: "none" }}
          />
          <UploadIcon />
          {isUploading ? someMessages.UPLOADING : someMessages.UPLOAD}
        </UploadButton>
      </UploadSection>

      <InputGroup>
        <label htmlFor="description">Course Description</label>
        <textarea
          id="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder={someMessages.DESCRIPTION_PLACEHOLDER}
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
