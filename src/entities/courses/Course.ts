export interface Course {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  currentUsers: number;
  completion: number;
}
