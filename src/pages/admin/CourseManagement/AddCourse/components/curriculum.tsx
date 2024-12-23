import React, { useState } from "react";
import { ChevronDownIcon, EditIcon, TrashIcon, PlusIcon } from "lucide-react";
import type { Curriculum, CurriculumSection } from "../form-types";
import {
  FormSection,
  ButtonGroup,
  Button,
  CurriculumSection as StyledCurriculumSection,
  AddSectionButton,
} from "../StyledComponents";

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

  const addSection = () => {
    const newSection = {
      id: sections.length + 1,
      name: "New Section",
      lectures: [],
    };
    setSections([...sections, newSection]);
    onUpdate({ sections: [...sections, newSection] });
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
                <button>
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
