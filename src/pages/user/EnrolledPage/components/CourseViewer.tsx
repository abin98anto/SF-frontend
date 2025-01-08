import React, { useState } from "react";
import "./CourseViewer.scss";
import { ICourse } from "../../../../entities/courses/Course";
import VideoPlayer from "./VideoPlayer";
import Curriculum from "./Curriculum";
import ChatBubble from "./ChatBubble";

interface CourseViewerProps {
  course: ICourse | undefined;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course }) => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>();

  return (
    <div className="course-viewer">
      <div className="course-header">
        <h1 className="course-title">{course?.basicInfo.title}</h1>

        <p className="course-subtitle">{course?.basicInfo.subtitle}</p>
      </div>

      <div className="course-content">
        <div className="video-section">
          <VideoPlayer
            videoUrl={currentVideoUrl}
            thumbnail={course?.advanceInfo?.thumbnail || undefined}
          />
        </div>

        <div className="curriculum-section">
          <Curriculum
            sections={course?.curriculum}
            onVideoSelect={setCurrentVideoUrl}
            completedLectures={[]}
          />
        </div>
      </div>

      <ChatBubble />
    </div>
  );
};

export default CourseViewer;
