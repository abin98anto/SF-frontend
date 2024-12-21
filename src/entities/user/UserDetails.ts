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
}

export interface rating {
  id: string;
  stars: number;
  comments?: string;
}
