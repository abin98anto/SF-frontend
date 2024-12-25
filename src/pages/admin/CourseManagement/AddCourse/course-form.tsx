"use client";

import { useState, useEffect } from "react";
import type { FormData } from "./form-types";
import { BasicInformation } from "./components/basic-information";
import { AdvanceInformation } from "./components/advance-information";
import { Curriculum } from "./components/curriculum";
import { ProgressSteps } from "./components/progress-steps";
import { ConfirmationModal } from "./components/ConfirmationModal";
// import { Snackbar } from "./components/Snackbar";
import { FormContainer, Header } from "./StyledComponents";
import { Snackbar } from "../../../../components/Snackbar/Snackbar";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "courseFormData";

export default function CourseForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
      thumbnail: null,
      description: "",
    },
    curriculum: {
      sections: [],
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData);
      // Determine the current step based on the data
      if (
        parsedData.curriculum &&
        parsedData.curriculum.sections &&
        parsedData.curriculum.sections.length > 0
      ) {
        setCurrentStep(3);
      } else if (
        parsedData.advanceInfo &&
        (parsedData.advanceInfo.description || parsedData.advanceInfo.thumbnail)
      ) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  }, []);

  useEffect(() => {
    const dataToStore = {
      ...formData,
      advanceInfo: {
        ...formData.advanceInfo,
        thumbnail: formData.advanceInfo.thumbnail
          ? "thumbnail_placeholder"
          : null,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  }, [formData]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
    setFormData({
      basicInfo: {
        title: "",
        subtitle: "",
        category: "",
        topic: "",
        language: "",
        duration: "",
      },
      advanceInfo: {
        thumbnail: null,
        description: "",
      },
      curriculum: {
        sections: [],
      },
    });
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
    setIsModalOpen(false);
    navigate("/admin/course-management");
  };

  const updateFormData = (
    section: keyof FormData,
    data: Partial<FormData[keyof FormData]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <FormContainer>
      <Header>
        <h1>Add a Course</h1>
      </Header>

      <ProgressSteps currentStep={currentStep} />

      {currentStep === 1 && (
        <BasicInformation
          data={formData.basicInfo}
          onUpdate={(data) => updateFormData("basicInfo", data)}
          onNext={handleNext}
          onCancel={handleCancel}
          setError={handleError}
        />
      )}

      {currentStep === 2 && (
        <AdvanceInformation
          data={formData.advanceInfo}
          onUpdate={(data) => updateFormData("advanceInfo", data)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onCancel={handleCancel}
          setError={handleError}
        />
      )}

      {currentStep === 3 && (
        <Curriculum
          data={formData.curriculum}
          onUpdate={(data) => updateFormData("curriculum", data)}
          onPrevious={handlePrevious}
          onCancel={handleCancel}
          setError={handleError}
          courseFormData={formData} // Add this line
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCancel}
        title="Discard Course"
        message="Are you sure you want to discard this course?"
      />

      <Snackbar
        message={error || ""}
        isVisible={!!error}
        onClose={() => setError(null)}
      />
    </FormContainer>
  );
}
