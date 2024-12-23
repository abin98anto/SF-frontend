export interface BasicInfo {
  title: string;
  subtitle: string;
  category: string;
  topic: string;
  language: string;
  duration: string;
}

export interface AdvanceInfo {
  thumbnail: File | null;
  description: string;
}

export interface CurriculumSection {
  id: number;
  name: string;
  lectures: Array<{
    id: number;
    name: string;
    type: "Video" | "Attach File";
  }>;
}

export interface Curriculum {
  sections: CurriculumSection[];
}

export interface FormData {
  basicInfo: BasicInfo;
  advanceInfo: AdvanceInfo;
  curriculum: Curriculum;
}
