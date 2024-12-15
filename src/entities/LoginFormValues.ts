export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserState {
  loading: boolean;
  error: string | null;
  userInfo: any | null; // Replace 'any' with your user info type
  isAuthenticated: boolean;
}
