import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import "./CourseManagement.scss";
import { Course } from "../../../entities/courses/Course";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";

interface APICourse {
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

export default function CoursesTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/admin/courses");

        // Transform the API data into the Course format
        const transformedCourses: Course[] = response.data.data.map(
          (course: APICourse) => ({
            id: course._id,
            name: course.basicInfo.title,
            description: course.advanceInfo.description,
            status: "Active", // Default value
            currentUsers: 0, // Default value
            completion: 0, // Default value
            subtitle: course.basicInfo.subtitle,
            duration: course.basicInfo.duration,
            language: course.basicInfo.language,
            createdAt: new Date(course.createdAt),
            updatedAt: new Date(course.updatedAt),
          })
        );

        setCourses(transformedCourses);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch courses"
        );
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
                  <th>CURRENT USERS</th>
                  <th>COMPLETION</th>
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
                    <td>{course.currentUsers.toLocaleString()}</td>
                    <td>{course.completion}%</td>
                    <td>
                      <div className="actions">
                        <button>
                          <Trash2 size={16} />
                        </button>
                        <button>
                          <Pencil size={16} />
                        </button>
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
    </div>
  );
}
