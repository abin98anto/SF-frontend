import React, { useState, useCallback } from "react";
import "./CourseViewer.scss";
import { ICourse, Lesson, Section } from "../../../../entities/courses/Course";
import VideoPlayer from "./VideoPlayer";
import Curriculum from "./Curriculum";
import ChatBubble from "./ChatBubble";

interface CourseViewerProps {
  course: ICourse | undefined;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course }) => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | undefined>();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLectures, setCompletedLectures] = useState<string[]>([]);

  const handleVideoSelect = useCallback((videoUrl: string, lesson: Lesson) => {
    setCurrentVideoUrl(videoUrl);
    setCurrentLesson(lesson);
  }, []);

  const handleLectureComplete = useCallback((lectureId: string) => {
    setCompletedLectures((prev) => {
      if (!prev.includes(lectureId)) {
        return [...prev, lectureId];
      }
      console.log("the lesson completed:", lectureId);
      return prev;
    });
  }, []);

  const handleLectureUncomplete = useCallback((lectureId: string) => {
    setCompletedLectures((prev) => prev.filter((id) => id !== lectureId));
  }, []);

  const findNextLesson = useCallback(
    (sections: Section[], currentLessonId: string): Lesson | null => {
      let foundCurrent = false;
      for (const section of sections) {
        for (const lecture of section.lectures) {
          if (foundCurrent) {
            return lecture;
          }
          if (lecture._id === currentLessonId) {
            foundCurrent = true;
          }
        }
      }
      return null;
    },
    []
  );

  const handleNextLesson = useCallback(() => {
    if (course && currentLesson) {
      const nextLesson = findNextLesson(course.curriculum, currentLesson._id);
      if (nextLesson) {
        handleVideoSelect(nextLesson.videoUrl, nextLesson);
      } else {
        console.log("This is the last lesson in the course.");
        // You might want to show a message to the user or handle this case differently
      }
    }
  }, [course, currentLesson, findNextLesson, handleVideoSelect]);

  return (
    <div className="course-viewer">
      <div className="course-content">
        <div className="main-content">
          <VideoPlayer
            videoUrl={currentVideoUrl}
            thumbnail={course?.advanceInfo?.thumbnail as string}
            onNextLesson={handleNextLesson}
            onLectureComplete={handleLectureComplete}
            currentLesson={currentLesson}
            courseName={course?.basicInfo.title || ""}
            courseDescription={course?.advanceInfo?.description || ""}
          />
        </div>
        <div className="sidebar">
          <Curriculum
            sections={course?.curriculum}
            onVideoSelect={handleVideoSelect}
            completedLectures={completedLectures}
            onLectureComplete={handleLectureComplete}
            onLectureUncomplete={handleLectureUncomplete}
            currentLessonId={currentLesson?._id}
          />
        </div>
      </div>
      <ChatBubble courseId={course?._id as string} />
    </div>
  );
};

export default CourseViewer;
