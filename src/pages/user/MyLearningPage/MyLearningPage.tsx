import { useState, useEffect } from "react";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import "./MyLearningPage.scss";
import axiosInstance from "../../../utils/axiosConfig";
import { Link } from "react-router-dom";
import { someMessages } from "../../../utils/constants";
import { ICourse } from "../../../entities/courses/Course";
import { useAppSelector } from "../../../hooks/hooks";
import { AppRootState } from "../../../redux/store";

const MyLearningPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<ICourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const coursesPerPage = 8;

  const userInfo = useAppSelector((state: AppRootState) => state.user.userInfo);

  useEffect(() => {
    if (!userInfo?._id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const userResponse = await axiosInstance.post(
          `/my-learning?userId=${userInfo._id}`
        );
        const enrolledCourseIds = userResponse.data.user;
        const coursesResponse = await axiosInstance.get("/courses");
        const allCourses = coursesResponse.data.data;

        const userEnrolledCourses = allCourses.filter((course: ICourse) =>
          enrolledCourseIds.includes(course._id)
        );

        setEnrolledCourses(userEnrolledCourses);
        setFilteredCourses(userEnrolledCourses);
        setLoading(false);
      } catch (err) {
        setError(someMessages.COURSE_FETCH_FAIL);
        setLoading(false);
        console.error(someMessages.COURSE_FETCH_FAIL, err);
      }
    };

    fetchData();
  }, [userInfo?._id]);

  useEffect(() => {
    const filtered = enrolledCourses.filter((course) =>
      course.basicInfo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchTerm, enrolledCourses]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="my-learning-page">Loading...</div>;
  }

  if (error) {
    return <div className="my-learning-page">Error: {error}</div>;
  }

  return (
    <div className="my-learning-page">
      <div className="container">
        <h1>My Learning</h1>

        <div className="controls">
          <div className="search">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon />
          </div>
        </div>

        <div className="course-grid">
          {currentCourses.map((course) => (
            <div key={course._id} className="course-card">
              <img
                src={course.advanceInfo.thumbnail || "/placeholder.svg"}
                alt={course.basicInfo.title}
              />

              <div className="course-info">
                <Link
                  to={`/course-enrolled?id=${course._id}`}
                  key={course._id}
                  className="course-card-link"
                >
                  <h2>{course.basicInfo.title}</h2>
                  <p>Language: {course.basicInfo.language}</p>
                  <p className="subtitle">{course.basicInfo.subtitle}</p>
                  <p className="category">
                    Category: {course.basicInfo.category}
                  </p>
                  <p>Duration: {course.basicInfo.duration}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon />
          </button>
          {Array.from({
            length: Math.ceil(filteredCourses.length / coursesPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredCourses.length / coursesPerPage)
            }
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyLearningPage;
