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
  isActive: boolean;
}
