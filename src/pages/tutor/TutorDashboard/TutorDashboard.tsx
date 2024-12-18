import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Avatar,
  IconButton,
  Box,
  Typography,
  Tooltip,
  DialogContentText,
} from "@mui/material";
import { PhotoCamera, FileUpload, Close, Logout } from "@mui/icons-material";
import { updateTutorProfile } from "../../../redux/features/tutor/tutorSlice";
import {
  handleFileUpload,
  validateImageFile,
  validatePdfFile,
} from "../../../utils/fileUpload";
import { toast } from "react-toastify";
import "./TutorDashboard.scss";
import { logoutUser } from "../../../redux/services/UserAuthServices";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../entities/user/UserRole";

const TutorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tutorInfo = useSelector(
    (state: RootState) => state.tutorLogin.tutorInfo
  );

  // Modal state
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Logout handlers
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logoutUser(UserRole.TUTOR))
      // logout(UserRole.TUTOR)
      .then(() => {
        toast.success("Logged out successfully");
        setLogoutDialogOpen(false);
        navigate("/tutor/login");
      })
      .catch((error: any) => {
        toast.error(error || "Logout failed");
      });
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Form state for editing
  const [editedProfile, setEditedProfile] = useState({
    name: tutorInfo?.name || "",
    email: tutorInfo?.email || "",
    profilePicture: tutorInfo?.profilePicture || "",
    resume: tutorInfo?.resume || "",
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
  });

  // Handle modal open
  const handleOpenModal = () => {
    setOpen(true);
    // Reset validation errors when opening modal
    setValidationErrors({ name: "", email: "" });
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpen(false);
  };

  // Validate name
  const validateName = (name: string): string => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (name.length > 50) {
      return "Name cannot exceed 50 characters";
    }
    const nameRegex = /^[a-zA-Z\s-]+$/;
    if (!nameRegex.test(name)) {
      return "Name can only contain letters, spaces, and hyphens";
    }
    return "";
  };

  // Validate email
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      const nameError = validateName(value);
      setValidationErrors((prev) => ({
        ...prev,
        name: nameError,
      }));
    }

    if (name === "email") {
      const emailError = validateEmail(value);
      setValidationErrors((prev) => ({
        ...prev,
        email: emailError,
      }));
    }
  };

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const imageUploadResult = await handleFileUpload(file, {
        validateFile: validateImageFile,
        onUploadStart: () => setIsUploading(true),
        onUploadEnd: () => setIsUploading(false),
      });

      if (imageUploadResult.success) {
        setEditedProfile((prev) => ({
          ...prev,
          profilePicture: imageUploadResult.url || "",
        }));
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error(
          imageUploadResult.error || "Failed to upload profile picture"
        );
      }
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const resumeUploadResult = await handleFileUpload(file, {
        validateFile: validatePdfFile,
        onUploadStart: () => setIsUploading(true),
        onUploadEnd: () => setIsUploading(false),
      });

      if (resumeUploadResult.success) {
        setEditedProfile((prev) => ({
          ...prev,
          resume: resumeUploadResult.url || "",
        }));
        toast.success("Resume uploaded successfully!");
      } else {
        toast.error(resumeUploadResult.error || "Failed to upload resume");
      }
    }
  };

  // Remove profile picture
  const handleRemoveProfilePicture = () => {
    setEditedProfile((prev) => ({
      ...prev,
      profilePicture: "",
    }));
  };

  const handleSubmit = () => {
    const nameError = validateName(editedProfile.name);
    const emailError = validateEmail(editedProfile.email);

    setValidationErrors({
      name: nameError,
      email: emailError,
    });

    if (nameError || emailError) {
      toast.error("Please correct the errors before submitting");
      return;
    }

    dispatch(updateTutorProfile(editedProfile));
    handleCloseModal();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">
        Welcome, {tutorInfo?.name || "Please login!"}!
      </h1>
      {tutorInfo && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogoutClick}
        >
          Logout
        </Button>
      )}

      {tutorInfo && (
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          View/Edit Profile
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 1,
          },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Edit Profile</Typography>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Box position="relative">
              <Avatar
                src={editedProfile.profilePicture}
                alt="Profile Picture"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: "3px solid",
                  borderColor: "primary.main",
                }}
              />
              {editedProfile.profilePicture && (
                <Tooltip title="Remove Profile Picture">
                  <IconButton
                    onClick={handleRemoveProfilePicture}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "error.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "error.dark",
                      },
                    }}
                    size="small"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="file-input"
              id="profile-picture-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="profile-picture-upload"
              className="file-input-label"
            >
              <Button
                component="span"
                variant="outlined"
                color="primary"
                startIcon={<PhotoCamera />}
                disabled={isUploading}
              >
                Change Profile Picture
              </Button>
            </label>
          </Box>

          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={editedProfile.name}
              onChange={handleInputChange}
              variant="outlined"
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={editedProfile.email}
              onChange={handleInputChange}
              variant="outlined"
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                fullWidth
                label="Resume"
                value={editedProfile.resume ? "Resume uploaded" : "No resume"}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />

              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="file-input"
                id="resume-upload"
                disabled={isUploading}
              />
              <label htmlFor="resume-upload" className="file-input-label">
                <Button
                  component="span"
                  variant="contained"
                  color="secondary"
                  startIcon={<FileUpload />}
                  disabled={isUploading}
                >
                  Upload
                </Button>
              </label>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={isUploading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TutorDashboard;
