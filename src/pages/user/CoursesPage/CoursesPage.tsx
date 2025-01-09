import { useState, useEffect } from "react";
import {
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import "./CoursesPage.scss";
import { Course } from "../../../entities/courses/Course";
import axiosInstance from "../../../utils/axiosConfig";
import { Link } from "react-router-dom";
import { API_ENDPOINTS, someMessages } from "../../../utils/constants";

interface APIResponse {
  data: Course[];
  message: string;
  success: boolean;
}

interface Category {
  _id: string;
  name: string;
}

interface CategoryResponse {
  data: Category[];
  message: string;
  success: boolean;
}

const CoursesPage = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const coursesPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const categoriesResponse = await axiosInstance.get<CategoryResponse>(
          API_ENDPOINTS.GET_CATS
        );
        const fetchedCategories = categoriesResponse.data.data;

        const coursesResponse = await axiosInstance.get<APIResponse>(
          API_ENDPOINTS.GET_COURSES
        );

        const activeCourses = coursesResponse.data.data.filter(
          (course) => course.isActive
        );

        setCategories([{ _id: "All", name: "All" }, ...fetchedCategories]);
        setAllCourses(activeCourses);
        setFilteredCourses(activeCourses);
        setLoading(false);
      } catch (err) {
        setError(someMessages.COURSE_FETCH_FAIL);
        setLoading(false);
        console.error(someMessages.COURSE_FETCH_FAIL, err);
      }
    };

    fetchData();
  }, []);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : categoryId;
  };
  
  useEffect(() => {
    const filtered = allCourses.filter(
      (course) =>
        course.basicInfo.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" ||
          course.basicInfo.category === selectedCategory)
    );
    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, allCourses]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="courses-page">Loading...</div>;
  }

  if (error) {
    return <div className="courses-page">Error: {error}</div>;
  }

  return (
    <div className="courses-page">
      <div className="container">
        <h1>Explore Courses</h1>

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

          <div className="filter">
            <FilterIcon />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="course-grid">
          {currentCourses.map((course) => (
            <div key={course._id} className="course-card">
              <img
                src={
                  course.advanceInfo.thumbnail ||
                  "/placeholder.svg?height=200&width=300"
                }
                alt={course.basicInfo.title}
              />

              <div className="course-info">
                <Link
                  to={`/course/${course._id}`}
                  key={course._id}
                  className="course-card-link"
                >
                  <h2>{course.basicInfo.title}</h2>
                  <p>Language : {course.basicInfo.language}</p>
                  <p className="subtitle">{course.basicInfo.subtitle}</p>
                  <p className="category">
                    Category : {getCategoryName(course.basicInfo.category)}
                  </p>
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

export default CoursesPage;
