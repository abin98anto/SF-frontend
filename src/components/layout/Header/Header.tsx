import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { logoutUser } from "../../../redux/features/userAuthSlice"; // Adjust the import path as needed
import "./Header.scss";
import { RootState, AppDispatch } from "../../../redux/store"; // Import AppDispatch

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false); // Manage the modal visibility

  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch here
  const { isAuthenticated, userInfo } = useSelector(
    (state: RootState) => state.userLogin
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Open the logout confirmation modal
  const handleLogoutModalOpen = () => {
    setOpenLogoutModal(true);
  };

  // Close the logout confirmation modal
  const handleLogoutModalClose = () => {
    setOpenLogoutModal(false);
  };

  // Handle logout action after confirmation
  const handleLogout = () => {
    dispatch(logoutUser()); // This should work correctly now
    setOpenLogoutModal(false); // Close the modal after logout
    handleProfileMenuClose(); // Close the profile menu
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          SkillForge
        </Link>

        {/* Hamburger Menu Icon */}
        <div
          className={`hamburger ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-content">
            <button className="close-menu" onClick={toggleMenu}>
              &times;
            </button>
            <nav className="mobile-nav">
              <ul>
                <li>
                  <Link to="/courses" onClick={toggleMenu}>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={toggleMenu}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/subscriptions" onClick={toggleMenu}>
                    Subscriptions
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Mobile Authentication Section */}
            {!isAuthenticated ? (
              <div className="mobile-auth">
                <Link to="/login" className="login" onClick={toggleMenu}>
                  Login
                </Link>
                <Link to="/signup" className="signup" onClick={toggleMenu}>
                  Signup
                </Link>
              </div>
            ) : (
              <div className="mobile-profile">
                <Link to="/profile" onClick={toggleMenu}>
                  Profile
                </Link>
                <button onClick={handleLogoutModalOpen}>Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav">
          <ul>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/subscriptions">Subscriptions</Link>
            </li>
          </ul>
        </nav>

        {/* Authentication/Profile Section */}
        {!isAuthenticated ? (
          <div className="auth">
            <Link to="/login" className="login">
              Login →
            </Link>
            <Link to="/signup" className="signup">
              Signup
            </Link>
          </div>
        ) : (
          <>
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar
                src={userInfo?.profilePicture}
                alt={userInfo?.firstName || "User"}
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid #primary.main",
                }}
              >
                {userInfo?.firstName?.[0]}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <Link
                  to="/profile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Profile
                </Link>
              </MenuItem>
              <MenuItem onClick={handleLogoutModalOpen}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={openLogoutModal}
        onClose={handleLogoutModalClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Are you sure you want to logout?</DialogTitle>
        <DialogActions>
          <Button onClick={handleLogoutModalClose} color="primary">
            No
          </Button>
          <Button onClick={handleLogout} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  );
};

export default Header;
