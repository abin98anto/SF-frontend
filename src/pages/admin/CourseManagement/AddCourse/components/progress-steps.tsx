import { CheckIcon } from "lucide-react";
import {
  ProgressStepsContainer,
  StepBox,
  StepIcon,
  StepText,
  StepProgress,
} from "../StyledComponents";

interface Step {
  id: number;
  name: string;
  progress: string;
}

interface ProgressStepsProps {
  currentStep: number;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps: Step[] = [
    { id: 1, name: "Basic Information", progress: "" },
    { id: 2, name: "Advance Information", progress: "" },
    { id: 3, name: "Curriculum", progress: "" },
  ];

  return (
    <ProgressStepsContainer>
      {steps.map((step: Step) => (
        <StepBox
          key={step.id}
          completed={currentStep > step.id}
          active={currentStep === step.id}
        >
          <StepIcon completed={currentStep > step.id}>
            {currentStep > step.id ? <CheckIcon size={12} /> : step.id}
          </StepIcon>
          <StepText
            completed={currentStep > step.id}
            active={currentStep === step.id}
          >
            {step.name}
          </StepText>
          <StepProgress>{step.progress}</StepProgress>
        </StepBox>
      ))}
    </ProgressStepsContainer>
  );
}
