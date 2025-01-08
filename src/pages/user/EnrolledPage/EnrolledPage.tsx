import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import CourseViewer from "./components/CourseViewer";
import { ICourse } from "../../../entities/courses/Course";
import { useSearchParams } from "react-router-dom";

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
  const [courseData, setCourseData] = useState<ICourse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/get-course?id=${courseId}`
        );
        console.log("the response ", response.data.data);
        setCourseData(response.data.data);
        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!courseData) return <div>No course data available</div>;

  return <CourseViewer course={courseData} />;
};

export default EnrolledPage;
