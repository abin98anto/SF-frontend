import styled from "styled-components";

export const FormContainer = styled.div`
  max-width: 80rem; // Increased from 64rem
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }
`;

export const ProgressStepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 4rem; // Increased horizontal padding
  background-color: #f3f4f6;
`;

export const StepBox = styled.div<{ completed?: boolean; active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${(props) =>
    props.completed || props.active ? "#ffffff" : "transparent"};
  border-radius: 0.25rem;
  box-shadow: ${(props) =>
    props.completed || props.active ? "0 1px 3px rgba(0,0,0,0.1)" : "none"};
`;

export const StepIcon = styled.div<{ completed?: boolean }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: ${(props) => (props.completed ? "#10B981" : "#E5E7EB")};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  font-size: 0.75rem;
`;

export const StepText = styled.span<{ completed?: boolean; active?: boolean }>`
  font-size: 0.875rem;
  color: ${(props) =>
    props.completed ? "#10B981" : props.active ? "#000000" : "#6B7280"};
  font-weight: ${(props) => (props.active ? "600" : "400")};
`;

export const StepProgress = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
`;

export const FormSection = styled.div`
  padding: 2rem 4rem; // Increased horizontal padding
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;

    &:focus {
      outline: none;
      ring: 2px solid rgba(255, 112, 82, 0.5);
    }
  }
`;

export const CharCount = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: right;
  margin-top: 0.25rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

export const Button = styled.button<{ primary?: boolean; secondary?: boolean }>`
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;

  ${({ primary }) =>
    primary &&
    `
    background-color: #FF7052;
    color: white;
    &:hover {
      opacity: 0.9;
    }
  `}

  ${({ secondary }) =>
    secondary &&
    `
    background-color: #F3F4F6;
    color: #4B5563;
    &:hover {
      background-color: #E5E7EB;
    }
  `}
`;

export const UploadSection = styled.div`
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
`;

export const UploadIcon = styled.div`
  margin: 0 auto 1rem;
  color: #9ca3af;
`;

export const UploadText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const UploadButton = styled.label`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ff7052;
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const CurriculumSection = styled.div`
  .section-item {
    background-color: #f9fafb;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lecture-item {
    background-color: white;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const AddSectionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(255, 112, 82, 0.1);
  color: #ff7052;
  text-align: center;
  border-radius: 0.5rem;
  margin-top: 1rem;

  &:hover {
    opacity: 0.9;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 400px;
  width: 100%;
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;
