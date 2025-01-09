import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import CourseViewer from "./components/CourseViewer";
import { ICourse } from "../../../entities/courses/Course";
import { useSearchParams } from "react-router-dom";
import { someMessages } from "../../../utils/constants";

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

        setCourseData(response.data.data);
        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : someMessages.UNKNOWN_ERROR;
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
