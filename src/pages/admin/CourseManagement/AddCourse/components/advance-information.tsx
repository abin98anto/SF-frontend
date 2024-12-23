import React from "react";
import { ImageIcon } from "lucide-react";
import type { AdvanceInfo } from "../form-types";
import {
  FormSection,
  InputGroup,
  ButtonGroup,
  Button,
  UploadSection,
  UploadIcon,
  UploadText,
  UploadButton,
} from "../StyledComponents";

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
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({ thumbnail: file });
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
          {data.thumbnail
            ? data.thumbnail.name
            : "Upload your course thumbnail"}
        </UploadText>
        <UploadButton>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            style={{ display: "none" }}
          />
          <UploadIcon>
            <UploadIcon />
          </UploadIcon>
          Upload
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
          <Button secondary onClick={onCancel} style={{ marginRight: "1rem" }}>
            Cancel
          </Button>
          <Button secondary onClick={onPrevious}>
            Back
          </Button>
        </div>
        <Button primary onClick={handleNext}>
          Save & Next
        </Button>
      </ButtonGroup>
    </FormSection>
  );
}
