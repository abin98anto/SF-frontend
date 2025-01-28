import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, UserRoundPlus } from "lucide-react";
import "./CourseManagement.scss";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import ConfirmationModal from "./UnlistCourse/ConfirmationModal";
import { API_ENDPOINTS, someMessages } from "../../../utils/constants";
import { useSelector } from "react-redux";
import type { AppRootState } from "../../../redux/store";
import { UserRole } from "../../../entities/user/UserRole";
import type { UserDetails } from "../../../entities/user/UserDetails";
import { getUsers } from "../../../redux/services/UserManagementServices";
import { useAppDispatch } from "../../../hooks/hooks";
import { AddTutorsModal } from "./AddTutors/AddTutorsModal";

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
  tutors: UserDetails[];
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  subtitle: string;
  duration: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  tutors: string[];
}

const booleanToStatus = (isActive: boolean): "Active" | "Inactive" => {
  return isActive ? "Active" : "Inactive";
};

export default function CoursesTable() {
  const [tutors, setTutors] = useState<UserDetails[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [addTutorsModalOpen, setAddTutorsModalOpen] = useState(false);
  const [selectedCourseForTutors, setSelectedCourseForTutors] =
    useState<Course | null>(null);
  const itemsPerPage = 7;

  const { isAuthenticated } = useSelector(
    (state: AppRootState) => state.adminLogin
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }

    fetchCourses();
    fetchTutors();
  }, []); // Added navigate to dependencies

  const fetchTutors = async () => {
    try {
      const response = await dispatch(getUsers(UserRole.TUTOR));
      const verifiedTutors = (response.payload as UserDetails[]).filter(
        (tutor) => tutor.isVerified === true
      );
      setTutors(verifiedTutors);
    } catch (err) {
      console.log(someMessages.TUTORS_FETCH_FAIL, err);
      setError(someMessages.TUTORS_FETCH_FAIL);
    }
  };

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
          tutors: course.tutors.map((tutor) => tutor._id),
        })
      );

      setCourses(transformedCourses.reverse());
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

  const handleAddTutors = (course: Course) => {
    setSelectedCourseForTutors(course);
    setAddTutorsModalOpen(true);
  };

  const handleConfirmAddTutors = async (selectedTutors: string[]) => {
    if (!selectedCourseForTutors) return;

    try {
      await axiosInstance.put(API_ENDPOINTS.COURSE_UPDATE, {
        _id: selectedCourseForTutors.id,
        tutors: selectedTutors,
      });

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === selectedCourseForTutors.id
            ? { ...course, tutors: selectedTutors }
            : course
        )
      );

      setAddTutorsModalOpen(false);
      setSelectedCourseForTutors(null);
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
                  <th>Tutor(s) Assigned</th>
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
                      {course.tutors && course.tutors.length > 0 ? (
                        <ul className="tutor-list">
                          {course.tutors.map((tutorId) => {
                            const tutor = tutors.find((t) => t._id === tutorId);
                            return tutor ? (
                              <li key={tutor._id}>{tutor.name}</li>
                            ) : null;
                          })}
                        </ul>
                      ) : (
                        "No Tutors Assigned"
                      )}
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
                        <button onClick={() => handleAddTutors(course)}>
                          <UserRoundPlus size={16} />
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
      <AddTutorsModal
        isOpen={addTutorsModalOpen}
        onClose={() => {
          setAddTutorsModalOpen(false);
          setSelectedCourseForTutors(null);
        }}
        onConfirm={handleConfirmAddTutors}
        allTutors={tutors}
        currentTutors={selectedCourseForTutors?.tutors || []}
      />
    </div>
  );
}
