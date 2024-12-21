import React, { useState } from "react";
import { useAppDispatch } from "../../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../redux/services/AdminAuthServices";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

interface LogoutModalProps {
  className?: string;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      let result = await dispatch(logoutAdmin()).unwrap();
      console.log("first", result);
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        role="button"
        className={`sign-out-button ${className}`}
        onClick={handleOpenModal}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleOpenModal()}
      >
        <LogoutIcon className="nav-icon" />
        <span className="nav-text">Sign-out</span>
      </div>

      <Dialog
        open={isOpen}
        onClose={handleCloseModal}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          Are you sure you want to log out?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            You will be redirected to the login page and your current session
            will end.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutModal;
