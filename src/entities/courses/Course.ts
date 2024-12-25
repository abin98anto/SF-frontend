export interface Course {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  currentUsers: number;
  completion: number;
}
