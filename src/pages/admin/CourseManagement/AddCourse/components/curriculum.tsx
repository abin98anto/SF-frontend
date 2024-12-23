import { useState, CSSProperties } from "react";
import { EditIcon, TrashIcon, PlusIcon } from "lucide-react";
import type { Curriculum, CurriculumSection } from "../form-types";
import {
  FormSection,
  ButtonGroup,
  Button,
  CurriculumSection as StyledCurriculumSection,
  AddSectionButton,
} from "../StyledComponents";

// Modal styles with proper TypeScript types
const modalStyles: {
  overlay: CSSProperties;
  modal: CSSProperties;
  input: CSSProperties;
  buttonContainer: CSSProperties;
} = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
};

interface CurriculumProps {
  data: Curriculum;
  onUpdate: (data: Partial<Curriculum>) => void;
  onPrevious: () => void;
  onCancel: () => void;
  setError: (error: string) => void;
}

export function Curriculum({
  data,
  onUpdate,
  onPrevious,
  onCancel,
  setError,
}: CurriculumProps) {
  const [sections, setSections] = useState<CurriculumSection[]>(
    data.sections || [
      {
        id: 1,
        name: "Section name",
        lectures: [{ id: 1, name: "Lecture name", type: "Video" }],
      },
    ]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

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
    setIsModalOpen(true);
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
    setIsModalOpen(false);
    setEditingSectionId(null);
    setEditingName("");
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

  const handlePublish = () => {
    if (validateForm()) {
      // Proceed with publishing
      console.log("Course published!");
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
                <button>
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
                  <select
                    value={lecture.type}
                    onChange={(e) => {
                      // Handle lecture type change
                    }}
                    style={{ marginLeft: "1rem" }}
                  >
                    <option>Video</option>
                    <option>Attach File</option>
                  </select>
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

      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Edit Section Name</h3>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              style={modalStyles.input}
            />
            <div style={modalStyles.buttonContainer}>
              <Button secondary onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button primary onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      <AddSectionButton onClick={addSection}>Add Sections</AddSectionButton>

      <ButtonGroup>
        <div>
          <Button secondary onClick={onCancel} style={{ marginRight: "1rem" }}>
            Cancel
          </Button>
          <Button secondary onClick={onPrevious}>
            Back
          </Button>
        </div>
        <Button primary onClick={handlePublish}>
          Publish Course
        </Button>
      </ButtonGroup>
    </FormSection>
  );
}
