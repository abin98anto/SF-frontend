import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import CourseViewer from "./components/CourseViewer";
import { ICourse } from "../../../entities/courses/Course";
import { useNavigate, useSearchParams } from "react-router-dom";
import { someMessages } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const EnrolledPage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [courseData, setCourseData] = useState<ICourse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
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
    }
  }, [courseId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!courseData) return <div>No course data available</div>;

  return <CourseViewer course={courseData} />;
};

export default EnrolledPage;
