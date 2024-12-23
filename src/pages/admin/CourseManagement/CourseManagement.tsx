import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import "./CourseManagement.scss";
import { Course } from "../../../entities/courses/Course";
import { Link } from "react-router-dom";

const initialCourses: Course[] = [];

export default function CoursesTable() {
  const [courses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
