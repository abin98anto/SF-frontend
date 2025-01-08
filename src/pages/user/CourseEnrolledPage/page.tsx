import CoursePlayer from "./CourseEnrolledPage";

export default function Page() {
  // This data would come from your backend
  const courseData = {
    courseTitle:
      "Complete Website Responsive Design: from Figma to Webflow to Website Design",
    sections: 6,
    totalLectures: 202,
    duration: "186:27m",
    videoUrl: "https://res.cloudinary.com/your-cloud/video/upload/your-video",
    progress: 15,
    chapters: [
      {
        id: 1,
        title: "Getting Started",
        lectures: [
          {
            id: 1,
            title: "What is Webflow?",
            duration: "07:31",
            completed: true,
          },
          // ... more lectures
        ],
        duration: "51m",
        lectureCount: 4,
      },
      // ... more chapters
    ],
    lectureFiles: [
      {
        id: 1,
        name: "Course Resources.zip",
        url: "/files/resources.zip",
      },
      // ... more files
    ],
  };

  return <CoursePlayer {...courseData} />;
}
