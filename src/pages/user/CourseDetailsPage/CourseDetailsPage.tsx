import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../../../utils/axiosConfig";
import { useAppSelector } from "../../../hooks/hooks";
import { ChevronDown, ChevronUp, Play, FileText } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

interface Course {
  _id: any;
  isActive: unknown;
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  subtitle: string;
  duration: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  basicInfo: {
    title: string;
    subtitle: string;
    category: string;
    topic: string;
    language: string;
    duration: string;
  };
  advanceInfo: {
    thumbnail: string | null;
    description: string;
  };
  curriculum: Array<{
    id: string;
    name: string;
    lectures: Array<{
      id: number;
      name: string;
      videoUrl: string | null;
      pdfUrls: string[];
      duration?: string;
    }>;
  }>;
}

const CourseDetailsPage: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [enrollingCourse, setEnrollingCourse] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const handleStartCourse = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Please Login",
        text: "You need to login to start this course",
        icon: "warning",
        showConfirmButton: true,
      });
      return;
    }

    if (!userInfo?.subscription?.name) {
      Swal.fire({
        title: "Subscription Required",
        text: "Please subscribe to access this course",
        icon: "warning",
        showConfirmButton: true,
      });
      return;
    }

    try {
      setEnrollingCourse(true);

      const enrollmentData = {
        coursesEnrolled: {
          courseId: id,
          tutorId: "",
          lastCompletedChapter: [],
          progressPercentage: 0,
          startDate: new Date(),
          endDate: null,
        },
      };

      await axiosInstance.patch(
        `/course-enroll?id=${userInfo._id}`,
        enrollmentData
      );

      Swal.fire({
        title: "Success!",
        text: "Successfully enrolled in the course",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(`/course-enrolled?id=${id}`);
    } catch (error) {
      console.error("Error enrolling in course:", error);

      if (axios.isAxiosError(error)) {
        Swal.fire({
          title: "Error",
          text: error.response?.data || "An error occurred while enrolling.",
          icon: "error",
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred.",
          icon: "error",
          showConfirmButton: true,
        });
      }
    } finally {
      setEnrollingCourse(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/course/${id}`);
        setCourse(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch course details");
        setLoading(false);
        console.error("Error fetching course details:", err);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const expandAllSections = () => {
    if (!course?.curriculum) return;

    const allSectionIds = course.curriculum.reduce((acc, section) => {
      if (section.id) {
        acc[section.id] = true;
      }
      return acc;
    }, {} as { [key: string]: boolean });

    setExpandedSections(allSectionIds);
  };

  const collapseAllSections = () => {
    setExpandedSections({});
  };

  const getTotalStats = () => {
    if (!course?.curriculum) {
      return { sections: 0, lectures: 0, totalDuration: "0" };
    }

    const sections = course.curriculum.length;
    const lectures = course.curriculum.reduce((total, section) => {
      if (!section.lectures) return total;
      return total + section.lectures.length;
    }, 0);

    return {
      sections,
      lectures,
      totalDuration: course.basicInfo?.duration || "0",
    };
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>No course found</div>;

  const { sections, lectures, totalDuration } = getTotalStats();

  return (
    <PageContainer>
      <CourseHeader>
        {course.advanceInfo?.thumbnail && (
          <CourseImage
            src={course.advanceInfo.thumbnail}
            alt={course.basicInfo?.title || "Course thumbnail"}
          />
        )}
        <CourseInfo>
          <h1>{course.basicInfo?.title}</h1>
          <p>{course.basicInfo?.subtitle}</p>
          <p>Category: {course.basicInfo?.category}</p>
          <p>Language: {course.basicInfo?.language}</p>
          <p>Duration: {course.basicInfo?.duration} hrs</p>
          <StartCourseButton
            onClick={handleStartCourse}
            disabled={enrollingCourse}
          >
            {enrollingCourse ? "Enrolling..." : "Start Course"}
          </StartCourseButton>
        </CourseInfo>
      </CourseHeader>

      <CourseDescription>
        <h2>About this course</h2>
        <p>{course.advanceInfo?.description}</p>
      </CourseDescription>

      <CourseCurriculum>
        <CurriculumHeader>
          <CourseStats>
            {sections} sections • {lectures} lectures • {totalDuration} total
            hours
          </CourseStats>
          <ExpandButton
            onClick={
              Object.keys(expandedSections).length === sections
                ? collapseAllSections
                : expandAllSections
            }
          >
            {Object.keys(expandedSections).length === sections
              ? "Collapse all sections"
              : "Expand all sections"}
          </ExpandButton>
        </CurriculumHeader>

        {course.curriculum.map((section) => (
          <Section key={section.id}>
            <SectionHeader onClick={() => toggleSection(section.id)}>
              <SectionInfo>
                <ChevronIcon>
                  {expandedSections[section.id] ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </ChevronIcon>
                <div>
                  <h3>{section.name}</h3>
                  <SectionMeta>
                    {section.lectures?.length || 0} lectures •{" "}
                    {section.lectures
                      ?.reduce(
                        (acc, lecture) =>
                          acc +
                          (lecture.duration ? parseFloat(lecture.duration) : 0),
                        0
                      )
                      .toFixed(2) || 0}{" "}
                    hours
                  </SectionMeta>
                </div>
              </SectionInfo>
            </SectionHeader>
            {expandedSections[section.id] && section.lectures && (
              <LectureList>
                {section.lectures.map((lecture) => (
                  <LectureItem key={lecture.id}>
                    <LectureInfo>
                      <LectureIcon>
                        {lecture.videoUrl ? (
                          <Play size={16} />
                        ) : (
                          <FileText size={16} />
                        )}
                      </LectureIcon>
                      <LectureTitle>{lecture.name}</LectureTitle>
                    </LectureInfo>
                    <LectureMeta>
                      {lecture.duration && (
                        <Duration>
                          {parseFloat(lecture.duration).toFixed(2)} hours
                        </Duration>
                      )}
                      {/* {lecture.videoUrl && <PreviewLink>Preview</PreviewLink>} */}
                    </LectureMeta>
                  </LectureItem>
                ))}
              </LectureList>
            )}
          </Section>
        ))}
      </CourseCurriculum>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CourseHeader = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const CourseImage = styled.img`
  width: 300px;
  height: auto;
  object-fit: cover;
`;

const CourseInfo = styled.div`
  flex: 1;
`;

const CourseDescription = styled.div`
  margin-bottom: 20px;
`;

const CourseCurriculum = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const CurriculumHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e0e0e0;
`;

const CourseStats = styled.div`
  font-size: 14px;
  color: #4b5563;
`;

const ExpandButton = styled.button`
  color: #6366f1;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Section = styled.div`
  border-bottom: 1px solid #e0e0e0;
  &:last-child {
    border-bottom: none;
  }
`;

const SectionHeader = styled.div`
  padding: 16px;
  cursor: pointer;
  background-color: #ffffff;

  &:hover {
    background-color: #f9fafb;
  }
`;

const SectionInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #111827;
  }
`;

const ChevronIcon = styled.div`
  color: #6b7280;
  margin-top: 2px;
`;

const SectionMeta = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
`;

const LectureList = styled.div`
  background-color: #f9fafb;
`;

const LectureItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 12px 48px;
  border-top: 1px solid #e5e7eb;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const LectureInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LectureIcon = styled.div`
  color: #6b7280;
`;

const LectureTitle = styled.span`
  font-size: 14px;
  color: #374151;
`;

const LectureMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Duration = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

// const PreviewLink = styled.button`
//   color: #6366f1;
//   background: none;
//   border: none;
//   cursor: pointer;
//   font-size: 14px;
//   font-weight: 500;

//   &:hover {
//     text-decoration: underline;
//   }
// `;

const StartCourseButton = styled.button`
  background-color: #6366f1;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4f46e5;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

export default CourseDetailsPage;
