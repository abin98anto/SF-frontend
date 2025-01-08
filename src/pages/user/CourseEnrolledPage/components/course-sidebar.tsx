"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./course-sidebar.scss";

interface Lecture {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface Chapter {
  id: number;
  title: string;
  lectures: Lecture[];
  duration: string;
  lectureCount: number;
}

interface CourseSidebarProps {
  progress: number;
  chapters: Chapter[];
}

export function CourseSidebar({ progress, chapters }: CourseSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1]); // First chapter expanded by default

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((current) =>
      current.includes(chapterId)
        ? current.filter((id) => id !== chapterId)
        : [...current, chapterId]
    );
  };

  return (
    <div className="sidebar">
      <div className="header">
        <h2>Course Contents</h2>
        <div className="progress">
          <div className="progressBar">
            <div className="progressFill" style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}% Completed</span>
        </div>
      </div>

      <div className="chapters">
        {chapters.map((chapter) => {
          const isExpanded = expandedChapters.includes(chapter.id);

          return (
            <div key={chapter.id} className="chapter">
              <div
                className="chapterHeader"
                onClick={() => toggleChapter(chapter.id)}
              >
                <ChevronDown
                  className={`icon ${isExpanded ? "expanded" : ""}`}
                />
                <div className="chapterInfo">
                  <h3>{chapter.title}</h3>
                  <span>
                    {chapter.lectureCount} lectures • {chapter.duration}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="lectures">
                  {chapter.lectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className={`lecture ${
                        lecture.completed ? "completed" : ""
                      }`}
                    >
                      <span>{lecture.title}</span>
                      <span>{lecture.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
