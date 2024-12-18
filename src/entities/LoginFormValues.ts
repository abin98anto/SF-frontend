export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserState {
  loading: boolean;
  error: string | null;
  userInfo: any | null;
  isAuthenticated: boolean;
}
