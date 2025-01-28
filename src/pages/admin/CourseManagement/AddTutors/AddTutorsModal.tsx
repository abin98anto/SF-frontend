import type React from "react";
import { useState, useEffect } from "react";
import type { UserDetails } from "../../../../entities/user/UserDetails";

interface AddTutorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedTutors: string[]) => void;
  allTutors: UserDetails[];
  currentTutors: string[];
}

export const AddTutorsModal: React.FC<AddTutorsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  allTutors,
  currentTutors,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTutors, setSelectedTutors] = useState<string[]>(currentTutors);

  useEffect(() => {
    setSelectedTutors(currentTutors);
  }, [currentTutors]);

  const filteredTutors = allTutors.filter((tutor) =>
    tutor.name!.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTutors = [...filteredTutors].sort((a, b) => {
    const aSelected = selectedTutors.includes(a._id!);
    const bSelected = selectedTutors.includes(b._id!);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  const handleTutorToggle = (tutorId: string) => {
    setSelectedTutors((prev) =>
      prev.includes(tutorId)
        ? prev.filter((id) => id !== tutorId)
        : [...prev, tutorId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="addT-modal-overlay">
      <div className="addT-modal-content">
        <h2>Add tutors to the course</h2>
        <input
          type="text"
          placeholder="Search tutors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="addT-tutor-search-input"
        />
        <div className="addT-tutor-list">
          {sortedTutors.map((tutor) => (
            <div
              key={tutor._id}
              className={`addT-tutor-item ${
                selectedTutors.includes(tutor._id!) ? "selected" : ""
              }`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={selectedTutors.includes(tutor._id!)}
                  onChange={() => handleTutorToggle(tutor._id!)}
                />
                {tutor.name}
              </label>
            </div>
          ))}
        </div>
        <div className="addT-modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onConfirm(selectedTutors)}>Confirm</button>
        </div>
      </div>
    </div>
  );
};
