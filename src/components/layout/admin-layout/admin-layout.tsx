import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../admin-sidebar/admin-sidebar";
import "./admin-layout.scss";

const AdminLayout: React.FC = () => {
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
