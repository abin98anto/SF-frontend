import React from "react";
import "./Curriculum.scss";
import { Section } from "../../../../entities/courses/Course";

interface CurriculumProps {
  sections: Section[] | undefined;

  onVideoSelect: (videoUrl: string) => void;
}

const Curriculum: React.FC<CurriculumProps> = ({ sections, onVideoSelect }) => {
  return (
    <div className="curriculum">
      <h2 className="curriculum-title">Course Content</h2>

      <div className="sections">
        {sections?.map((section, index) => (
          <div key={index} className="section">
            <h3 className="section-title">{section.name}</h3>

            <div className="lectures">
              {section.lectures.map((lecture, lectureIndex) => (
                <button
                  key={lectureIndex}
                  className="lecture"
                  onClick={() =>
                    lecture.videoUrl && onVideoSelect(lecture.videoUrl)
                  }
                >
                  <span className="lecture-name">{lecture.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Curriculum;
