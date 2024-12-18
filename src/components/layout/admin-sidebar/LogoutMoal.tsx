import React, { useState } from "react";
import { useAppDispatch } from "../../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../../redux/features/admin/adminAuthSlice";
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
      await dispatch(logoutAdmin()).unwrap();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        className={`sign-out-button ${className}`}
        onClick={handleOpenModal}
      >
        <LogoutIcon className="nav-icon" />
        <span className="nav-text">Sign-out</span>
      </button>

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
