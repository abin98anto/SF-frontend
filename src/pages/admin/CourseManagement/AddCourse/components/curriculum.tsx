import React, { useState, useEffect } from "react";
import {
  EditIcon,
  TrashIcon,
  PlusIcon,
  UploadIcon,
  XIcon,
  CheckCircle,
} from "lucide-react";
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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [sections, setSections] = useState<CurriculumSection[]>(
    data.sections || []
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [deletingItemType, setDeletingItemType] = useState<
    "section" | "lesson" | null
  >(null);
  const [editingName, setEditingName] = useState("");
  const [newLessonName, setNewLessonName] = useState("");
  const [newLessonVideo, setNewLessonVideo] = useState<File | null>(null);
  const [newLessonPdfs, setNewLessonPdfs] = useState<File[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPdfs, setUploadingPdfs] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    setSections(data.sections || []);
  }, [data.sections]);

  const addSection = () => {
    const newSection: CurriculumSection = {
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
    setEditingLessonId(null);
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
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate("/admin/course-management");
        }, 4000);
      } catch (error) {
        console.error("Error publishing course:", error);
        setError("Failed to publish course. Please try again.");
      } finally {
        setPublishing(false);
      }
    }
  };

  const handleEditLessonClick = (sectionId: number, lessonId: number) => {
    setEditingSectionId(sectionId);
    setEditingLessonId(lessonId);
    const section = sections.find((s) => s.id === sectionId);
    const lesson = section?.lectures.find((l) => l.id === lessonId);
    if (lesson) {
      setNewLessonName(lesson.name);
      setNewLessonPdfs([]);
      setIsEditLessonModalOpen(true);
    }
  };

  const handleUpdateLesson = async () => {
    if (!newLessonName.trim()) {
      setError("Lesson name is required");
      return;
    }

    let videoUrl = "";
    if (newLessonVideo) {
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
      videoUrl = videoUploadResult.url as string;
    }

    setUploadingPdfs(true);
    const pdfUploadPromises = newLessonPdfs.map((pdf) =>
      handleFileUpload(pdf, {
        validateFile: validatePdfFile,
      })
    );
    const pdfUploadResults = await Promise.all(pdfUploadPromises);
    setUploadingPdfs(false);

    const newPdfUrls = pdfUploadResults
      .filter((result) => result.success)
      .map((result) => result.url as string);

    const updatedSections = sections.map((section) => {
      if (section.id === editingSectionId) {
        const updatedLectures = section.lectures.map((lecture) => {
          if (lecture.id === editingLessonId) {
            return {
              ...lecture,
              name: newLessonName,
              videoUrl: videoUrl || lecture.videoUrl,
              pdfUrls: [...lecture.pdfUrls, ...newPdfUrls],
            };
          }
          return lecture;
        });
        return { ...section, lectures: updatedLectures };
      }
      return section;
    });

    setSections(updatedSections);
    onUpdate({ sections: updatedSections });
    setIsEditLessonModalOpen(false);
    resetLessonForm();
  };

  const handleRemoveExistingPdf = (
    sectionId: number,
    lessonId: number,
    pdfUrl: string
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedLectures = section.lectures.map((lecture) => {
          if (lecture.id === lessonId) {
            return {
              ...lecture,
              pdfUrls: lecture.pdfUrls.filter((url) => url !== pdfUrl),
            };
          }
          return lecture;
        });
        return { ...section, lectures: updatedLectures };
      }
      return section;
    });

    setSections(updatedSections);
    onUpdate({ sections: updatedSections });
  };

  const handleDeleteClick = (
    type: "section" | "lesson",
    sectionId: number,
    lessonId?: number
  ) => {
    setEditingSectionId(sectionId);
    setEditingLessonId(lessonId || null);
    setDeletingItemType(type);
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingItemType === "section") {
      const updatedSections = sections.filter(
        (section) => section.id !== editingSectionId
      );
      setSections(updatedSections);
      onUpdate({ sections: updatedSections });
    } else if (
      deletingItemType === "lesson" &&
      editingSectionId &&
      editingLessonId
    ) {
      const updatedSections = sections.map((section) => {
        if (section.id === editingSectionId) {
          return {
            ...section,
            lectures: section.lectures.filter(
              (lecture) => lecture.id !== editingLessonId
            ),
          };
        }
        return section;
      });
      setSections(updatedSections);
      onUpdate({ sections: updatedSections });
    }
    setIsDeleteConfirmationOpen(false);
    setDeletingItemType(null);
    setEditingSectionId(null);
    setEditingLessonId(null);
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
                <button
                  onClick={() => handleDeleteClick("section", section.id)}
                >
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
                  <button
                    onClick={() =>
                      handleEditLessonClick(section.id, lecture.id)
                    }
                  >
                    <EditIcon size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteClick("lesson", section.id, lecture.id)
                    }
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </StyledCurriculumSection>

      <AddSectionButton onClick={addSection}>Add Section</AddSectionButton>

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

      {isEditLessonModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Edit Lesson</ModalTitle>
            <InputGroup>
              <label htmlFor="editLessonName">Lesson Name</label>
              <input
                id="editLessonName"
                type="text"
                value={newLessonName}
                onChange={(e) => setNewLessonName(e.target.value)}
                style={modalStyles.input}
              />
            </InputGroup>
            <InputGroup>
              <label htmlFor="editLessonVideo">Change Video</label>
              <UploadButton as="label" htmlFor="editLessonVideo">
                <input
                  id="editLessonVideo"
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoUpload}
                  style={{ display: "none" }}
                />
                <UploadIcon size={16} />
                {newLessonVideo ? "Change Video" : "Upload New Video"}
              </UploadButton>
              {newLessonVideo && <p>{newLessonVideo.name}</p>}
            </InputGroup>
            <InputGroup>
              <label htmlFor="editLessonPdfs">Add PDFs</label>
              <UploadButton as="label" htmlFor="editLessonPdfs">
                <input
                  id="editLessonPdfs"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handlePdfUpload}
                  style={{ display: "none" }}
                />
                <UploadIcon size={16} />
                Add PDFs
              </UploadButton>
              <div style={modalStyles.fileList}>
                {sections
                  .find((s) => s.id === editingSectionId)
                  ?.lectures.find((l) => l.id === editingLessonId)
                  ?.pdfUrls.map((pdfUrl, index) => (
                    <div key={index} style={modalStyles.fileItem}>
                      <span>{pdfUrl.split("/").pop()}</span>
                      <button
                        onClick={() =>
                          handleRemoveExistingPdf(
                            editingSectionId!,
                            editingLessonId!,
                            pdfUrl
                          )
                        }
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  ))}
                {newLessonPdfs.map((pdf, index) => (
                  <div key={`new-${index}`} style={modalStyles.fileItem}>
                    <span>{pdf.name}</span>
                    <button onClick={() => handleRemovePdf(index)}>
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </InputGroup>
            <ModalButtonGroup>
              <Button onClick={() => setIsEditLessonModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateLesson}
                disabled={uploadingVideo || uploadingPdfs}
              >
                {uploadingVideo || uploadingPdfs
                  ? "Uploading..."
                  : "Update Lesson"}
              </Button>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {isDeleteConfirmationOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Confirm Deletion</ModalTitle>
            <p>Are you sure you want to delete this {deletingItemType}?</p>
            <p>This action cannot be undone.</p>
            <ModalButtonGroup>
              <Button onClick={() => setIsDeleteConfirmationOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Delete
              </Button>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {isSuccessModalOpen && (
        <ModalOverlay>
          <ModalContent
            style={{
              background: "linear-gradient(135deg, #4CAF50, #45a049)",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              color: "white",
              textAlign: "center",
            }}
          >
            <CheckCircle size={64} style={{ marginBottom: "1rem" }} />
            <ModalTitle style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Course Created Successfully!
            </ModalTitle>
            <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
              Your course has been published. Redirecting to course
              management...
            </p>
            <div
              style={{
                width: "100%",
                height: "4px",
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "white",
                  animation: "progress 4s linear",
                }}
              />
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

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
