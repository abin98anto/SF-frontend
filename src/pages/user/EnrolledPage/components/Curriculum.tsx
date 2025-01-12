import React, { useState } from "react";
import "./Curriculum.scss";
import { Section, Lesson } from "../../../../entities/courses/Course";
import { ChevronDown, ChevronUp, CheckIcon } from "lucide-react";
import Modal from "./Modal";

interface CurriculumProps {
  sections: Section[] | undefined;
  onVideoSelect: (videoUrl: string, lesson: Lesson) => void;
  completedLectures: string[];
  onLectureComplete: (lectureId: string) => void;
  onLectureUncomplete: (lectureId: string) => void;
  currentLessonId: string | undefined;
}

const Curriculum: React.FC<CurriculumProps> = ({
  sections,
  onVideoSelect,
  completedLectures,
  onLectureComplete,
  onLectureUncomplete,
  currentLessonId,
}) => {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLecture, setCurrentLecture] = useState<Lesson | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCheckboxClick = (e: React.MouseEvent, lecture: Lesson) => {
    e.stopPropagation();
    if (completedLectures.includes(lecture._id)) {
      onLectureUncomplete(lecture._id);
    } else {
      setCurrentLecture(lecture);
      setIsModalOpen(true);
    }
  };

  const handleConfirmComplete = () => {
    if (currentLecture) {
      onLectureComplete(currentLecture._id);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="curriculum">
      <h2 className="curriculum-title">Course content</h2>
      <div className="sections">
        {sections?.map((section, index) => (
          <div key={index} className="section">
            <button
              className="section-header"
              onClick={() => toggleSection(index)}
            >
              <div className="section-title">
                <span>
                  Section {index + 1}: {section.name}
                </span>
                <span className="section-info">
                  {section.lectures.length} lecture
                  {section.lectures.length > 1 ? "s" : ""}
                </span>
              </div>
              {expandedSections.includes(index) ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {expandedSections.includes(index) && (
              <div className="lectures">
                {section.lectures.map((lecture, lectureIndex) => (
                  <button
                    key={lectureIndex}
                    className={`lecture ${
                      currentLessonId === lecture._id ? "current-lesson" : ""
                    }`}
                    onClick={() =>
                      lecture.videoUrl &&
                      onVideoSelect(lecture.videoUrl, lecture)
                    }
                  >
                    <div
                      className={`lecture-checkbox ${
                        completedLectures.includes(lecture._id)
                          ? "completed"
                          : ""
                      }`}
                      onClick={(e) => handleCheckboxClick(e, lecture)}
                    >
                      {completedLectures.includes(lecture._id) && (
                        <CheckIcon size={16} />
                      )}
                    </div>
                    <span className="lecture-name">{lecture.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmComplete}
        message="Have you completed this lesson?"
      />
    </div>
  );
};

export default Curriculum;
