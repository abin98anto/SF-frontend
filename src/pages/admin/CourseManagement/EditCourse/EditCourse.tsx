import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosConfig";
import { ProgressSteps } from "../AddCourse/components/progress-steps";
import { BasicInformation } from "../AddCourse/components/basic-information";
import { AdvanceInformation } from "../AddCourse/components/advance-information";
import { Curriculum } from "../AddCourse/components/curriculum";
import { FormData, CurriculumSection } from "../AddCourse/form-types";
import { API_ENDPOINTS, someMessages } from "../../../../utils/constants";

export function EditCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state?.courseId;

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    basicInfo: {
      title: "",
      subtitle: "",
      category: "",
      topic: "",
      language: "",
      duration: "",
    },
    advanceInfo: {
      thumbnail: "",
      description: "",
    },
    curriculum: {
      sections: [],
    },
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    } else {
      setError(someMessages.NO_COURSE_ID);
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/get-course?id=${courseId}`
      );
      const courseData = response.data.data;

      if (
        !courseData ||
        !courseData.curriculum ||
        !Array.isArray(courseData.curriculum)
      ) {
        throw new Error(someMessages.INVALID_COURSE);
      }

      const processedSections: CurriculumSection[] = courseData.curriculum.map(
        (section: any, index: number) => ({
          id: index + 1,
          name: section.name,
          lectures: Array.isArray(section.lectures)
            ? section.lectures.map((lecture: any, lectureIndex: number) => ({
                id: lectureIndex + 1,
                name: lecture.name,
                videoUrl: lecture.videoUrl,
                pdfUrls: lecture.pdfUrls || [],
              }))
            : [],
        })
      );

      setFormData({
        basicInfo: {
          title: courseData.basicInfo?.title || "",
          subtitle: courseData.basicInfo?.subtitle || "",
          category: courseData.basicInfo?.category || "",
          topic: courseData.basicInfo?.topic || "",
          language: courseData.basicInfo?.language || "",
          duration: courseData.basicInfo?.duration || "",
        },
        advanceInfo: {
          thumbnail: courseData.advanceInfo?.thumbnail || "",
          description: courseData.advanceInfo?.description || "",
        },
        curriculum: {
          sections: processedSections,
        },
      });
    } catch (error) {
      console.error(someMessages.COURSE_FETCH_FAIL, error);
      setError(someMessages.COURSE_FETCH_FAIL);
    }
  };

  const handleUpdate = (
    section: keyof FormData,
    data: Partial<FormData[keyof FormData]>
  ) => {
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [section]: { ...prevData[section], ...data },
      };
      localStorage.setItem("courseFormData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    navigate(API_ENDPOINTS.COURSE_M);
  };

  const handleSubmit = async () => {
    try {
      const transformedCurriculum = formData.curriculum.sections.map(
        (section) => ({
          name: section.name,
          lectures: section.lectures.map((lecture) => ({
            name: lecture.name,
            videoUrl: lecture.videoUrl,
            pdfUrls: lecture.pdfUrls,
          })),
        })
      );

      const courseData = {
        basicInfo: {
          title: formData.basicInfo.title,
          subtitle: formData.basicInfo.subtitle,
          category: formData.basicInfo.category,
          topic: formData.basicInfo.topic,
          language: formData.basicInfo.language,
          duration: formData.basicInfo.duration,
        },
        advanceInfo: {
          thumbnail: formData.advanceInfo.thumbnail,
          description: formData.advanceInfo.description,
        },
        curriculum: transformedCurriculum,
        _id: courseId,
      };

      await axiosInstance.put(
        `/admin/update-course?id=${courseId}`,
        courseData
      );
      localStorage.removeItem("courseFormData");
      navigate(API_ENDPOINTS.COURSE_M);
    } catch (error) {
      console.error(someMessages.COURSE_UPDATE_FAIL, error);
      setError(someMessages.COURSE_UPDATE_FAIL);
    }
  };

  if (!courseId) {
    return (
      <div className="error">
        No course ID provided. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <ProgressSteps currentStep={currentStep} />
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {error}
        </div>
      )}
      {currentStep === 1 && (
        <BasicInformation
          data={formData.basicInfo}
          onUpdate={(data) => handleUpdate("basicInfo", data)}
          onNext={handleNext}
          onCancel={handleCancel}
          setError={setError}
        />
      )}
      {currentStep === 2 && (
        <AdvanceInformation
          data={formData.advanceInfo}
          onUpdate={(data) => handleUpdate("advanceInfo", data)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onCancel={handleCancel}
          setError={setError}
        />
      )}
      {currentStep === 3 && (
        <Curriculum
          data={formData.curriculum}
          onUpdate={(data) => handleUpdate("curriculum", data)}
          onPrevious={handlePrevious}
          onCancel={handleCancel}
          setError={setError}
          courseFormData={formData}
        />
      )}
      {currentStep === 3 && (
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Update Course
        </button>
      )}
    </div>
  );
}
