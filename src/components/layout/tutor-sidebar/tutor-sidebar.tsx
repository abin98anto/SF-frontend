import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart2, BookOpen, UserCog } from "lucide-react";
import "./tutor-sidebar.scss";
import LogoutModal from "../admin-sidebar/LogoutMoal";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart2,
    path: "/tutor/dashboard",
  },
  {
    title: "My Students",
    icon: BookOpen,
    path: "/tutor/my-students",
  },
  {
    title: "Messages",
    icon: UserCog,
    path: "/tutor/messages",
  },
];

export default function TutorSidebar() {
  const [isCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleSignOut = () => {
    navigate("/tutor/login");
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
        <button className="sign-out-button" onClick={handleSignOut}>
          <LogoutModal />
        </button>
      </div>
    </div>
  );
}
