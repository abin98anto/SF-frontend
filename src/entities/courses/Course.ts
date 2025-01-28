import { UserDetails } from "../user/UserDetails";

export interface Course {
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
  tutors: UserDetails[];
}

// export interface Lesson {
//   _id: number;
//   name: string;
//   videoUrl: string;
//   pdfUrls: string[];
// }

// export interface Section {
//   _id: string;
//   name: string;
//   lectures: Lecture[];
// }

// export interface ICourse {
//   basicInfo: {
//     title: string;
//     subtitle: string;
//     category: string;
//     topic: string;
//     language: string;
//     duration: string;
//   };
//   advanceInfo: {
//     thumbnail: string | null;
//     description: string;
//   };
//   curriculum: Section[];
//   isActive: boolean;
// }

// export interface Message {
//   id: number;
//   text: string;
//   sender: "user" | "system";
//   timestamp: string;
// }

// interface Lecture {
//   _id?: string;
//   name: string;
//   videoUrl: string;
// }

export interface Lesson {
  _id: string;
  name: string;
  videoUrl: string;
  pdfUrls: string[];
}

export interface Section {
  name: string;
  lectures: Lesson[];
}

export interface ICourse {
  _id?: string;
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
  curriculum: Section[];
  tutors?: string[];
  isActive: Boolean;
}
