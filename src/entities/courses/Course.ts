export interface Course {
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
  curriculum: {
    sections: Array<{
      id: number;
      name: string;
      lectures: Array<{
        id: number;
        name: string;
        videoUrl: string | null;
        pdfUrls: string[];
      }>;
    }>;
  };
}
