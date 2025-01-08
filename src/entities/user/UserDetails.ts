export enum SubscriptionType {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
}

export interface Subscription {
  name: SubscriptionType;
  startDate: Date;
  endDate: Date;
}

export interface UserDetails {
  isVerified: any;
  _id?: string | null;
  id?: string | null;
  email?: string | null;
  name?: string | null;
  role?: string | null;
  profilePicture?: string | null;
  resume?: string | null;
  dateJoined?: string | null;
  isActive?: boolean | null;
  otp?: number | null;
  otpExpiration?: Date | null;
  ratings?: rating[] | null;
  students?: [] | null;
  reviewsTaken?: number | null;
  sessionsTaken?: number | null;
  wallet?: number | null;
  subscription?: Subscription;
  coursesEnrolled?: CoursesEnrolled[];
}

export interface rating {
  id: string;
  stars: number;
  comments?: string;
}

export class CoursesEnrolled {
  constructor(
    public courseId: string,
    public tutorId: string,
    public lastCompletedChapter: number[],
    public progressPercentage: number,
    public startDate: Date,
    public endDate: Date | null
  ) {}
}
