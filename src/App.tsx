// import { useEffect, useState } from "react";
// import { Snackbar } from "./components/ui/Snackbar"; // Import Snackbar
// import { socket } from "./utils/socketConfig";
// import { MessageContext } from "./contexts/MessageContext";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { PersistGate } from "redux-persist/integration/react";
// import store, { AppRootState, persistor } from "./redux/store";
// import { Provider } from "react-redux";
import UserLayout from "./components/layout/UserLayout/UserLayout";
import AdminLayout from "./components/layout/admin-layout/admin-layout";
import LandingPage from "./pages/user/LandingPage/LandingPage";
import SignupPage from "./pages/user/SignupPage/SignupPage";
import LoginPage from "./pages/user/LoginPage/LoginPage";
import CoursePage from "./pages/user/CoursesPage/CoursesPage";
import SubscriptionPage from "./pages/user/SubscriptionPage/SubscriptionPage";
import CourseDetailsPage from "./pages/user/CourseDetailsPage/CourseDetailsPage";
import EnrolledPage from "./pages/user/EnrolledPage/EnrolledPage";
import MyLearningPage from "./pages/user/MyLearningPage/MyLearningPage";
import TutorSignup from "./pages/tutor/TutorSignup/TutorSignup";
import TutorLogin from "./pages/tutor/TutorLogin/TutorLogin";
import TutorDashboard from "./pages/tutor/TutorDashboard/TutorDashboard";
import MyStudents from "./pages/tutor/MyStudents/MyStudents";
import TutorChat from "./pages/tutor/TutorChat/TutorChat";
import TutorProfile from "./pages/tutor/TutorProfile/TutorProfile";
import AdminLogin from "./pages/admin/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard";
import CourseManagement from "./pages/admin/CourseManagement/CourseManagement";
import CourseForm from "./pages/admin/CourseManagement/AddCourse/course-form";
import TutorManagement from "./pages/admin/TutorManagement/TutorManagement";
import UserManagement from "./pages/admin/UserManagement/UserManagement";
import BatchManagement from "./pages/admin/SubsManagement/SubsManagement";
import Ledger from "./pages/admin/Ledger/Ledger";
import CategoryManagement from "./pages/admin/CategoryManagement/CategoryManagement";
import NotFound from "./pages/404Page/404Page";
import { TutorLayout } from "./components/layout/tutor-layout/tutor-layout";
import { EditCourse } from "./pages/admin/CourseManagement/EditCourse/EditCourse";
import VideoCallPage from "./pages/tutor/VideoCallPage/VideoCallPage";
import { NotificationProvider } from "./contexts/NotificationContext";
// import { Snackbar } from "./components/Snackbar/Snackbar";
// import { useAppSelector } from "./hooks/hooks";
// import { IMessage } from "./entities/messages/IMessages";

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

      <Route path="/video-call" element={<VideoCallPage />} />

      <Route path="*" element={<NotFound />} />
    </>
  )
);

const App = () => {
  // const [messages, setMessages] = useState<any[]>([]);
  // const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");

  // const { userInfo } = useAppSelector((state: AppRootState) => state.user);
  // const { userInfo: tutorInfo } = useAppSelector(
  //   (state: AppRootState) => state.tutor
  // );

  // const addMessage = (message: any) => {
  //   setMessages((prev) => [...prev, message]);
  // };

  // useEffect(() => {
  //   const handleReceiveMessage = (message: IMessage) => {
  //     const userId = userInfo?._id || tutorInfo?._id;
  //     console.log("user iiis ", userId);
  //     if (userId !== message.senderId) {
  //       addMessage(message);
  //       // console.log("the message recieved!", message);
  //       // Show snackbar instead of toast
  //       setSnackbarMessage(`New message: ${message.content}`);
  //       setSnackbarVisible(true);

  //       setTimeout(() => {
  //         setSnackbarVisible(false);
  //       }, 3500);
  //     }
  //   };

  //   socket.on("receive_message", handleReceiveMessage);

  //   return () => {
  //     socket.off("receive_message", handleReceiveMessage);
  //   };
  // }, []);

  return (
    <NotificationProvider>
      <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
        {/* <MessageContext.Provider value={{ messages, addMessage }}>
        <Snackbar
          message={snackbarMessage}
          isVisible={isSnackbarVisible}
          onClose={() => setSnackbarVisible(false)}
        /> */}
        <RouterProvider router={router} />
        {/* </MessageContext.Provider> */}
      </GoogleOAuthProvider>
    </NotificationProvider>
  );
};

export default App;
