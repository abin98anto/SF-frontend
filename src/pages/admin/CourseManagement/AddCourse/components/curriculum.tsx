import React, { useState, CSSProperties } from "react";
import { EditIcon, TrashIcon, PlusIcon, UploadIcon, XIcon } from "lucide-react";
import type {
  Curriculum,
  CurriculumSection,
  Lecture,
  FormData,
} from "../form-types";
import {
  FormSection,
  ButtonGroup,
  Button,
  CurriculumSection as StyledCurriculumSection,
  AddSectionButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalButtonGroup,
  InputGroup,
  UploadButton,
  modalStyles,
} from "../StyledComponents";
import {
  handleFileUpload,
  validateVideoFile,
  validatePdfFile,
} from "../../../../../utils/fileUpload";
import axiosInstance from "../../../../../utils/axiosConfig";

interface CurriculumProps {
  data: Curriculum;
  onUpdate: (data: Partial<Curriculum>) => void;
  onPrevious: () => void;
  onCancel: () => void;
  setError: (error: string) => void;
  courseFormData: FormData;
}

export function Curriculum({
  data,
  onUpdate,
  onPrevious,
  onCancel,
  setError,
  courseFormData,
}: CurriculumProps) {
  const [sections, setSections] = useState<CurriculumSection[]>(
    data.sections || []
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newLessonName, setNewLessonName] = useState("");
  const [newLessonVideo, setNewLessonVideo] = useState<File | null>(null);
  const [newLessonPdfs, setNewLessonPdfs] = useState<File[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPdfs, setUploadingPdfs] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const addSection = () => {
    const newSection = {
      id: sections.length + 1,
      name: "New Section",
      lectures: [],
    };
    setSections([...sections, newSection]);
    onUpdate({ sections: [...sections, newSection] });
  };

  const handleEditClick = (section: CurriculumSection) => {
    setEditingSectionId(section.id);
    setEditingName(section.name);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingSectionId === null) return;

    const updatedSections = sections.map((section) =>
      section.id === editingSectionId
        ? { ...section, name: editingName }
        : section
    );

    setSections(updatedSections);
    onUpdate({ sections: updatedSections });
    setIsEditModalOpen(false);
    setEditingSectionId(null);
    setEditingName("");
  };

  const handleAddLessonClick = (sectionId: number) => {
    setEditingSectionId(sectionId);
    setIsAddLessonModalOpen(true);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateVideoFile(file)) {
      setNewLessonVideo(file);
    } else {
      setError(
        "Invalid video file. Please upload a valid MP4, WebM, or OGG video file (max 100MB)."
      );
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validPdfs = Array.from(files).filter(validatePdfFile);
      setNewLessonPdfs((prev) => [...prev, ...validPdfs]);
    }
  };

  const handleRemovePdf = (index: number) => {
    setNewLessonPdfs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateLesson = async () => {
    if (!newLessonName.trim()) {
      setError("Lesson name is required");
      return;
    }

    if (!newLessonVideo) {
      setError("Video is required");
      return;
    }

    setUploadingVideo(true);
    const videoUploadResult = await handleFileUpload(newLessonVideo, {
      onUploadStart: () => setUploadingVideo(true),
      onUploadEnd: () => setUploadingVideo(false),
      validateFile: validateVideoFile,
    });

    if (!videoUploadResult.success) {
      setError(videoUploadResult.error || "Failed to upload video");
      return;
    }

    setUploadingPdfs(true);
    const pdfUploadPromises = newLessonPdfs.map((pdf) =>
      handleFileUpload(pdf, {
        validateFile: validatePdfFile,
      })
    );
    const pdfUploadResults = await Promise.all(pdfUploadPromises);
    setUploadingPdfs(false);

    const pdfUrls = pdfUploadResults
      .filter((result) => result.success)
      .map((result) => result.url as string);

    const newLesson: Lecture = {
      id: Date.now(),
      name: newLessonName,
      videoUrl: videoUploadResult.url as string,
      pdfUrls,
    };

    const updatedSections = sections.map((section) =>
      section.id === editingSectionId
        ? { ...section, lectures: [...section.lectures, newLesson] }
        : section
    );

    setSections(updatedSections);
    onUpdate({ sections: updatedSections });
    setIsAddLessonModalOpen(false);
    resetLessonForm();
  };

  const resetLessonForm = () => {
    setNewLessonName("");
    setNewLessonVideo(null);
    setNewLessonPdfs([]);
    setEditingSectionId(null);
  };

  const validateForm = () => {
    if (sections.length === 0) {
      setError("At least one section is required");
      return false;
    }
    for (const section of sections) {
      if (section.lectures.length === 0) {
        setError("Each section must have at least one lecture");
        return false;
      }
    }
    return true;
  };

  const handlePublish = async () => {
    if (validateForm()) {
      try {
        setPublishing(true);
        const response = await axiosInstance.post(
          "/admin/add-course",
          courseFormData
        );
        console.log("Course published successfully:", response.data);
        // Handle successful publication (e.g., show success message, redirect)
      } catch (error) {
        console.error("Error publishing course:", error);
        setError("Failed to publish course. Please try again.");
      } finally {
        setPublishing(false);
      }
    }
  };

  return (
    <FormSection>
      <h2>Course Curriculum</h2>

      <StyledCurriculumSection>
        {sections.map((section: CurriculumSection) => (
          <div key={section.id} className="section-item">
            <div className="section-header">
              <h3>
                Section {String(section.id).padStart(2, "0")}: {section.name}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => handleAddLessonClick(section.id)}>
                  <PlusIcon size={16} />
                </button>
                <button onClick={() => handleEditClick(section)}>
                  <EditIcon size={16} />
                </button>
                <button>
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>

            {section.lectures.map((lecture) => (
              <div key={lecture.id} className="lecture-item">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{lecture.name}</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button>
                    <EditIcon size={16} />
                  </button>
                  <button>
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </StyledCurriculumSection>

      {isEditModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Edit Section Name</ModalTitle>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              style={modalStyles.input}
            />
            <ModalButtonGroup>
              <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {isAddLessonModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Add New Lesson</ModalTitle>
            <InputGroup>
              <label htmlFor="lessonName">Lesson Name</label>
              <input
                id="lessonName"
                type="text"
                value={newLessonName}
                onChange={(e) => setNewLessonName(e.target.value)}
                style={modalStyles.input}
              />
            </InputGroup>
            <InputGroup>
              <label htmlFor="lessonVideo">Upload Video</label>
              <UploadButton as="label" htmlFor="lessonVideo">
                <input
                  id="lessonVideo"
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoUpload}
                  style={{ display: "none" }}
                />
                <UploadIcon size={16} />
                {newLessonVideo ? "Change Video" : "Upload Video"}
              </UploadButton>
              {newLessonVideo && <p>{newLessonVideo.name}</p>}
            </InputGroup>
            <InputGroup>
              <label htmlFor="lessonPdfs">Upload PDFs</label>
              <UploadButton as="label" htmlFor="lessonPdfs">
                <input
                  id="lessonPdfs"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handlePdfUpload}
                  style={{ display: "none" }}
                />
                <UploadIcon size={16} />
                Upload PDFs
              </UploadButton>
              <div style={modalStyles.fileList}>
                {newLessonPdfs.map((pdf, index) => (
                  <div key={index} style={modalStyles.fileItem}>
                    <span>{pdf.name}</span>
                    <button onClick={() => handleRemovePdf(index)}>
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </InputGroup>
            <ModalButtonGroup>
              <Button onClick={() => setIsAddLessonModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateLesson}
                disabled={uploadingVideo || uploadingPdfs}
              >
                {uploadingVideo || uploadingPdfs
                  ? "Uploading..."
                  : "Create Lesson"}
              </Button>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      <AddSectionButton onClick={addSection}>Add Sections</AddSectionButton>

      <ButtonGroup>
        <div>
          <Button onClick={onCancel} style={{ marginRight: "1rem" }}>
            Cancel
          </Button>
          <Button onClick={onPrevious}>Back</Button>
        </div>
        <Button onClick={handlePublish} disabled={publishing}>
          {publishing ? "Publishing..." : "Publish Course"}
        </Button>
      </ButtonGroup>
    </FormSection>
  );
}
