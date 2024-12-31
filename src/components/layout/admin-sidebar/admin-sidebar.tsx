import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart2,
  BookOpen,
  Users,
  UserCog,
  Layers,
  BookCheck,
  SquareStack,
} from "lucide-react";
import "./admin-sidebar.scss";
import LogoutModal from "./LogoutMoal";

const menuItems = [
  { title: "Dashboard", icon: BarChart2, path: "/admin/dashboard" },
  {
    title: "Course Management",
    icon: BookOpen,
    path: "/admin/course-management",
  },
  { title: "Tutor Management", icon: UserCog, path: "/admin/tutor-management" },
  { title: "User Management", icon: Users, path: "/admin/user-management" },
  {
    title: "Subscription Management",
    icon: Layers,
    path: "/admin/batch-management",
  },
  { title: "Ledger", icon: BookCheck, path: "/admin/ledger" },
  {
    title: "Category Management",
    icon: SquareStack,
    path: "/admin/category-management",
  },
];

export default function Sidebar() {
  const [isCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    navigate("/admin/login");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h1 className="logo">SkillForge</h1>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon className="nav-icon" />
              <span className="nav-text">{item.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sign-out-button"
          onClick={() => setShowLogoutModal(true)}
        >
          Sign Out
        </button>
      </div>

      {showLogoutModal && (
        <LogoutModal
          isVisible={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleSignOut}
        />
      )}
    </div>
  );
}
