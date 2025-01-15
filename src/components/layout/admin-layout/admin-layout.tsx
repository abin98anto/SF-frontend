import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../admin-sidebar/admin-sidebar";
import "./admin-layout.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { API_ENDPOINTS } from "../../../utils/constants";

const AdminLayout: React.FC = () => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.adminLogin
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(API_ENDPOINTS.ADMIN_DASH);
    }
  });

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
