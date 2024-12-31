import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import UserLayout from "./components/layout/UserLayout/UserLayout";
import LandingPage from "./pages/user/LandingPage/LandingPage";
import CoursePage from "./pages/user/CoursesPage/CoursesPage";
import AboutPage from "./pages/user/AboutPage/AboutPage";
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
import { EditCourse } from "./pages/admin/CourseManagement/EditCourse/EditCourse";
import { PublicRoute } from "./components/ProtectedRoute/PublicRoute";
import { ProtectedRuote } from "./components/ProtectedRoute/ProtectedRoute";
import CourseDetailsPage from "./pages/user/CourseDetailsPage/CourseDetailsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* User routes remain the same */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={
            <PublicRoute userType="user">
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute userType="user">
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRuote userType="user">
              <SubscriptionPage />
            </ProtectedRuote>
          }
        />
      </Route>

      {/* Tutor routes remain the same */}
      <Route path="/tutor">
        <Route
          path="signup"
          element={
            <PublicRoute userType="tutor">
              <TutorSignup />
            </PublicRoute>
          }
        />
        <Route
          path="login"
          element={
            <PublicRoute userType="tutor">
              <TutorLogin />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRuote userType="tutor">
              <TutorLayout />
            </ProtectedRuote>
          }
        >
          <Route path="dashboard" element={<TutorDashboard />} />
          <Route path="my-students" element={<MyStudents />} />
          <Route path="messages" element={<TutorChat />} />
          <Route path="profile" element={<TutorProfile />} />
        </Route>
      </Route>

      {/* Admin routes*/}
      <Route path="/admin">
        <Route
          path="login"
          element={
            // <PublicRoute userType="admin">
            <AdminLogin />
            // </PublicRoute>
          }
        />
        <Route
          element={
            // <ProtectedRuote userType="admin">
            <AdminLayout />
            // </ProtectedRuote>
          }
        >
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
    </>
  )
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer position="top-right" autoClose={3000} />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
