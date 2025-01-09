import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import "./CourseManagement.scss";
import { Course } from "../../../entities/courses/Course";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import ConfirmationModal from "./UnlistCourse/ConfirmationModal";
import { API_ENDPOINTS, someMessages } from "../../../utils/constants";

interface APICourse {
  isActive: boolean;
  _id: string;
  basicInfo: {
    title: string;
    subtitle: string;
    duration: string;
    language: string;
  };
  advanceInfo: {
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

const booleanToStatus = (isActive: boolean): "Active" | "Inactive" => {
  return isActive ? "Active" : "Inactive";
};

export default function CoursesTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/admin/courses");

      const transformedCourses: Course[] = response.data.data.map(
        (course: APICourse) => ({
          id: course._id,
          name: course.basicInfo.title,
          description: course.advanceInfo.description,
          status: booleanToStatus(course.isActive),
          subtitle: course.basicInfo.subtitle,
          duration: course.basicInfo.duration,
          language: course.basicInfo.language,
          createdAt: new Date(course.createdAt),
          updatedAt: new Date(course.updatedAt),
        })
      );

      setCourses(transformedCourses);
    } catch (err) {
      console.error(someMessages.COURSE_FETCH_FAIL, err);
      setError(
        err instanceof Error ? err.message : someMessages.COURSE_FETCH_FAIL
      );
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (course: Course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedCourse) return;

    try {
      let newIsActive;
      selectedCourse.status === "Active"
        ? (newIsActive = false)
        : (newIsActive = true);
      await axiosInstance.put(API_ENDPOINTS.COURSE_UPDATE, {
        _id: selectedCourse.id,
        isActive: newIsActive,
      });

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === selectedCourse.id
            ? { ...course, status: booleanToStatus(newIsActive) }
            : course
        )
      );

      setModalOpen(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error(someMessages.COURSE_UPDATE_FAIL, err);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return <div className="courses-wrapper">Loading courses...</div>;
  }

  if (error) {
    return <div className="courses-wrapper">Error: {error}</div>;
  }

  return (
    <div className="courses-wrapper">
      <div className="courses-container">
        <div className="header">
          <h1>Course Management</h1>
        </div>

        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="add-course-btn">
            <Plus size={16} />
            <Link to={"/admin/course-management/add"}>Add Course</Link>
          </button>
        </div>

        <div className="table-container">
          {displayedCourses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>NAME</th>
                  <th>DESCRIPTION</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {displayedCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{course.name}</td>
                    <td>{course.description}</td>
                    <td>
                      <span
                        className={`status-badge ${course.status.toLowerCase()}`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button onClick={() => handleStatusToggle(course)}>
                          <Trash2 size={16} />
                        </button>
                        <Link
                          to="/admin/course-management/edit"
                          state={{ courseId: course.id }}
                        >
                          <button>
                            <Pencil size={16} />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleConfirmStatusChange}
        title={`${
          selectedCourse?.status === "Active" ? "Unlist" : "List"
        } Course`}
        message={`Are you sure you want to ${
          selectedCourse?.status === "Active" ? "unlist" : "list"
        } "${selectedCourse?.name}"?`}
      />
    </div>
  );
}
