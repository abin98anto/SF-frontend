"use client";

import { useState } from "react";
import "./CourseEnrolledPage.scss";
import { MessageCircle } from "lucide-react";
import { CourseHeader } from "./components/course-header";
import { VideoPlayer } from "./components/video-player";
import { CourseSidebar } from "./components/course-sidebar";
import { LectureFiles } from "./components/lecture-files";
import { ChatBox } from "./components/chat-box";

interface CoursePlayerProps {
  courseTitle: string;
  sections: number;
  totalLectures: number;
  duration: string;
  videoUrl: string;
  progress: number;
  chapters: Chapter[];
  lectureFiles: LectureFile[];
}

interface Chapter {
  id: number;
  title: string;
  lectures: Lecture[];
  duration: string;
  lectureCount: number;
}

interface Lecture {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
}

interface LectureFile {
  id: number;
  name: string;
  url: string;
}

export default function CoursePlayer({
  courseTitle,
  sections,
  totalLectures,
  duration,
  videoUrl,
  progress,
  chapters,
  lectureFiles,
}: CoursePlayerProps) {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="container">
      <div className="header">
        <CourseHeader
          course={{
            title: courseTitle,
            description: `${sections} sections • ${totalLectures} lectures • ${duration}`,
          }}
          onBackClick={() => {
            /* Add back functionality */
          }}
          onQuitClick={() => {
            /* Add quit functionality */
          }}
        />
      </div>

      <div className="wrapper">
        <div className="mainContent">
          <div className="videoSection">
            <VideoPlayer url={videoUrl} />
          </div>

          <div className="lectureInfo">
            <div className="tabs">
              <button className="activeTab">Description</button>
              <button>Lecture Files</button>
            </div>

            <div className="filesSection">
              <LectureFiles files={lectureFiles} />
            </div>
          </div>
        </div>

        <aside className="sidebar">
          <CourseSidebar progress={progress} chapters={chapters} />
        </aside>

        {showChat && (
          <div className="chatOverlay">
            <ChatBox />
          </div>
        )}

        <button className="chatToggle" onClick={() => setShowChat(!showChat)}>
          <MessageCircle />
        </button>
      </div>
    </div>
  );
}
