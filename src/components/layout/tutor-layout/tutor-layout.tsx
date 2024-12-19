import { Outlet } from "react-router-dom";
import TutorSidebar from "../tutor-sidebar/tutor-sidebar";
import "./tutor-layout.scss";

export const TutorLayout = () => {
  return (
    <div className="tutor-layout">
      <TutorSidebar />
      <div className="tutor-content">
        <Outlet />
      </div>
    </div>
  );
};
