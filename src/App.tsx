import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import UserLayout from "./components/layout/UserLayout/UserLayout";
import LandingPage from "./pages/user/LandingPage/LandingPage";
import CoursePage from "./pages/user/CoursesPage/CoursesPage";
// import AboutPage from "./pages/user/MyLearningPage/MyLearningPage";
import SubscriptionPage from "./pages/user/SubscriptionPage/SubscriptionPage";
import SignupPage from "./pages/user/SignupPage/SignupPage";
import LoginPage from "./pages/user/LoginPage/LoginPage";
import TutorSignup from "./pages/tutor/TutorSignup/TutorSignup";
import TutorLogin from "./pages/tutor/TutorLogin/TutorLogin";
import TutorDashboard from "./pages/tutor/TutorDashboard/TutorDashboard";
import AdminLogin from "./pages/admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard";
import AdminLayout from "./components/layout/admin-layout/admin-layout";
import CourseManagement from "./pages/admin/CourseManagement/CourseManagement";
import UserManagement from "./pages/admin/UserManagement/UserManagement";
import BatchManagement from "./pages/admin/SubsManagement/SubsManagement";
import Ledger from "./pages/admin/Ledger/Ledger";
import TutorManagement from "./pages/admin/TutorManagement/TutorManagement";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import { Provider } from "react-redux";
import { TutorLayout } from "./components/layout/tutor-layout/tutor-layout";
import MyStudents from "./pages/tutor/MyStudents/MyStudents";
import TutorChat from "./pages/tutor/TutorChat/TutorChat";
import TutorProfile from "./pages/tutor/TutorProfile/TutorProfile";
import { ToastContainer } from "react-toastify";
import CategoryManagement from "./pages/admin/CategoryManagement/CategoryManagement";
import CourseForm from "./pages/admin/CourseManagement/AddCourse/course-form";
import CourseDetailsPage from "./pages/user/CourseDetailsPage/CourseDetailsPage";
import { EditCourse } from "./pages/admin/CourseManagement/EditCourse/EditCourse";
import EnrolledPage from "./pages/user/EnrolledPage/EnrolledPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NotFound from "./pages/404Page/404Page";
import MyLearningPage from "./pages/user/MyLearningPage/MyLearningPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<UserLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/course-enrolled" element={<EnrolledPage />} />
        <Route path="/my-learning" element={<MyLearningPage />} />
      </Route>

      <Route path="/tutor">
        <Route path="signup" element={<TutorSignup />} />
        <Route path="login" element={<TutorLogin />} />
        <Route element={<TutorLayout />}>
          <Route path="dashboard" element={<TutorDashboard />} />
          <Route path="my-students" element={<MyStudents />} />
          <Route path="messages" element={<TutorChat />} />
          <Route path="profile" element={<TutorProfile />} />
        </Route>
      </Route>

      <Route path="/admin">
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="course-management">
            <Route index element={<CourseManagement />} />
            <Route path="add" element={<CourseForm />} />
            <Route path="edit" element={<EditCourse />} />
          </Route>
          <Route path="tutor-management" element={<TutorManagement />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="batch-management" element={<BatchManagement />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="category-management" element={<CategoryManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer position="top-right" autoClose={3000} />
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
