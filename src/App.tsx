import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import UserLayout from './components/layout/UserLayout/UserLayout';
import LandingPage from './pages/user/LandingPage/LandingPage';
import CoursePage from './pages/user/CoursesPage/CoursesPage';
import AboutPage from './pages/user/AboutPage/AboutPage';
import SubscriptionPage from './pages/user/SubscriptionPage/SubscriptionPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<UserLayout />}>
      <Route path="/" element={<LandingPage />} />
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