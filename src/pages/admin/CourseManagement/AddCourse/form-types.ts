export interface BasicInfo {
  title: string;
  subtitle: string;
  category: string;
  topic: string;
  language: string;
  duration: string;
}

export interface AdvanceInfo {
  thumbnail: string | null;
  description: string;
}

export interface Lecture {
  id: number;
  name: string;
  videoUrl: string | null;
  pdfUrls: string[];
}

export interface CurriculumSection {
  id: number;
  name: string;
  lectures: Lecture[];
}

export interface Curriculum {
  sections: CurriculumSection[];
}

export interface FormData {
  basicInfo: BasicInfo;
  advanceInfo: AdvanceInfo;
  curriculum: Curriculum;
}

