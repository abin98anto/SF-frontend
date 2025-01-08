import CourseViewer from "./components/CourseViewer";

const mockCourse = {
  basicInfo: {
    title: "Complete Web Development Course",
    subtitle: "Learn modern web development from scratch",
    category: "Development",
    topic: "Web Development",
    language: "English",
    duration: "20 hours",
  },
  advanceInfo: {
    thumbnail: "/placeholder.svg",
    description: "Comprehensive web development course",
  },
  curriculum: [
    {
      _id: "1", // Use string
      name: "Getting Started",
      lectures: [
        {
          _id: "101", // Use string
          name: "Introduction to Web Development",
          videoUrl: "https://example.com/intro.mp4",
        },
        {
          _id: "102", // Use string
          name: "Setting Up Your Development Environment",
          videoUrl: "https://example.com/setup.mp4",
        },
      ],
    },
    {
      _id: "2", // Use string
      name: "HTML Fundamentals",
      lectures: [
        {
          _id: "201", // Use string
          name: "HTML Basics",
          videoUrl: "https://example.com/html-basics.mp4",
        },
        {
          _id: "202", // Use string
          name: "HTML Forms",
          videoUrl: "https://example.com/html-forms.mp4",
        },
      ],
    },
  ],
  isActive: true,
};

const EnrolledPage = () => {
  return <CourseViewer course={mockCourse} />;
};

export default EnrolledPage;
