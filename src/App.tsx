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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<UserLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/courses" element={<CoursePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/subscriptions" element={<SubscriptionPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
