import axios from "axios";

// Create Axios Instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     config.withCredentials = true;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add a response interceptor for handling 401 errors
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (originalRequest.url.includes("/login")) {
//         return Promise.reject(error);
//       }

//       try {
//         await axiosInstance.post("/refresh-token");
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }

//     // Reject other errors
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
