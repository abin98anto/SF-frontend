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
import AdminDashboad from "./pages/admin/AdminDashboard/AdminDashboad";
import AdminLayout from "./components/layout/admin-layout/admin-layout";
import CourseManagement from "./pages/admin/CourseManagement/CourseManagement";
import UserManagement from "./pages/admin/UserManagement/UserManagement";
import BatchManagement from "./pages/admin/BatchManagement/BatchManagement";
import Ledger from "./pages/admin/Ledger/Ledger";
import TutorManagement from "./pages/admin/TutorManagement/TutorManagement";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<UserLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
      </Route>

      {/* Tutor routes */}
      <Route path="/tutor">
        <Route path="signup" element={<TutorSignup />} />
        <Route path="login" element={<TutorLogin />} />
        <Route path="dashboard" element={<TutorDashboard />} />
      </Route>

      <Route path="/admin">
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboad />} />
          <Route path="course-management" element={<CourseManagement />} />
          <Route path="tutor-management" element={<TutorManagement />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="batch-management" element={<BatchManagement />} />
          <Route path="ledger" element={<Ledger />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
