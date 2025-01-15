import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart2,
  Users,
  MessageCircleMore,
  CircleUserRound,
} from "lucide-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import "./tutor-sidebar.scss";
import { useAppDispatch } from "../../../hooks/hooks";
import { logoutTutor } from "../../../redux/services/UserAuthServices";
import { UserRole } from "../../../entities/user/UserRole";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart2,
    path: "/tutor/dashboard",
  },
  {
    title: "My Students",
    icon: Users,
    path: "/tutor/my-students",
  },
  {
    title: "Messages",
    icon: MessageCircleMore,
    path: "/tutor/messages",
  },
  {
    title: "Profile",
    icon: CircleUserRound,
    path: "/tutor/profile",
  },
];

export default function TutorSidebar() {
  const dispatch = useAppDispatch();
  const [isCollapsed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await dispatch(logoutTutor(UserRole.TUTOR)).unwrap();
    navigate("/tutor/login");
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const confirmLogout = () => {
    closeDialog();
    handleSignOut();
  };

  return (
    <div className={`tutor-sidebar ${isCollapsed ? "tutor-collapsed" : ""}`}>
      <div className="tutor-sidebar-header">
        <h1 className="tutor-logo">SkillForge</h1>
      </div>

      <nav className="tutor-sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`tutor-nav-item ${isActive ? "tutor-active" : ""}`}
            >
              <item.icon className="tutor-nav-icon" />
              <span className="tutor-nav-text">{item.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="tutor-sidebar-footer">
        <button className="tutor-sign-out-button" onClick={openDialog}>
          Logout
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        aria-labelledby="tutor-logout-confirmation-dialog"
      >
        <DialogTitle id="tutor-logout-confirmation-dialog">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
