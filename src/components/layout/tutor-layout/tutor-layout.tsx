import { Outlet, useNavigate } from "react-router-dom";
import TutorSidebar from "../tutor-sidebar/tutor-sidebar";
import "./tutor-layout.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";
import { API_ENDPOINTS } from "../../../utils/constants";

export const TutorLayout = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.tutor);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(API_ENDPOINTS.TUTOR_DASH);
    }
  });

  return (
    <div className="tutor-layout">
      <TutorSidebar />
      <div className="tutor-content">
        <Outlet />
      </div>
    </div>
  );
};
