export interface UserDetails {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  profilePicture?: string;
  resume?: string;
  dateJoined?: string;
  isActive?: boolean;
  otp?: number;
  otpExpiration?: Date;
  ratings?: rating[];
  students?: [];
  reviewsTaken?: number;
  sessionsTaken?: number;
  wallet?: number;
}

export interface rating {
  id: string;
  stars: number;
  comments?: string;
}
