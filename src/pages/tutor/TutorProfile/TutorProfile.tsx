import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { updateUser } from "../../../redux/services/userUpdateService";
import { RootState } from "../../../redux/store";
import "./TutorProfile.scss";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import { createPortal } from "react-dom";

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Modal Component
const ResumeModal = ({
  isOpen,
  onClose,
  resumeUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          height: "90%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <iframe
          src={resumeUrl}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Resume Viewer"
        />
      </div>
    </div>,
    document.body
  );
};

const ProfileSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user info from Redux state
  const { loading, userInfo } = useSelector((state: RootState) => state.tutor);

  const [profileImage, setProfileImage] = useState<string | null>(
    userInfo?.profilePicture || "/default-avatar.png"
  );
  const [resume, setResume] = useState<string | null>(userInfo?.resume || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (userInfo) {
      setValue("name", userInfo.name || "");
      setValue("email", userInfo.email || "");
      setProfileImage(userInfo.profilePicture || "/default-avatar.png");
    }
  }, [userInfo, setValue]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedImageUrl = await uploadToCloudinary(file);
      setProfileImage(uploadedImageUrl);
      await dispatch(updateUser({ profilePicture: uploadedImageUrl }));
      setUpdateSuccess(true);
      setUpdateError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUpdateError("Failed to upload image");
    }
  };

  const deleteImage = async () => {
    try {
      setProfileImage("/default-avatar.png");
      await dispatch(updateUser({ profilePicture: null }));
      setUpdateSuccess(true);
      setUpdateError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUpdateError("Failed to upload image");
    }
  };

  const handleResumeChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const resumeUrl = await uploadToCloudinary(file);
      setResume(resumeUrl);
      await dispatch(updateUser({ resume: resumeUrl }));
      setUpdateSuccess(true);
      setUpdateError(null);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setUpdateError("Failed to upload resume");
    }
  };

  const deleteResume = async () => {
    try {
      setResume(null);
      await dispatch(updateUser({ resume: null }));
      setUpdateSuccess(true);
      setUpdateError(null);
    } catch (error) {
      console.error("Error deleting resume: ", error);
      setUpdateError("Failed to delete resume");
    }
  };

  const onSubmitPersonalInfo = async (data: ProfileFormData) => {
    try {
      setUpdateError(null);
      setUpdateSuccess(false);
      await dispatch(updateUser(data));
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateError(
        typeof error === "string" ? error : "Failed to update profile"
      );
    }
  };

  const handleCancel = () => {
    if (userInfo) {
      setValue("name", userInfo.name || "");
      setValue("email", userInfo.email || "");
    } else {
      reset();
    }
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  return (
    <Box className="profile-section">
      <Typography variant="h4" className="profile-header">
        Profile Settings
      </Typography>

      {updateError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {updateError}
        </Alert>
      )}

      {updateSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      {/* Profile Picture Section */}
      <Box className="profile-picture-container">
        <Box className="profile-picture-section">
          <Avatar src={profileImage || ""} className="profile-avatar" />
          <Box className="profile-picture-actions">
            <input
              type="file"
              accept="image/*"
              id="profile-image-input"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="profile-image-input">
              <Button
                component="span"
                startIcon={<EditIcon />}
                variant="outlined"
                className="change-photo-btn"
              >
                Change Photo
              </Button>
            </label>
            <IconButton
              color="error"
              size="small"
              className="delete-photo-btn"
              disabled={!profileImage || profileImage === "/default-avatar.png"}
              onClick={deleteImage}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4} className="main-content">
        <Grid item xs={12} md={6} className="left-column">
          <form onSubmit={handleSubmit(onSubmitPersonalInfo)}>
            <Box className="basic-info-section">
              <Typography variant="h6" gutterBottom className="section-title">
                Personal Information
              </Typography>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
                className="form-field"
                InputLabelProps={{
                  className: "field-label",
                }}
                InputProps={{
                  className: "input-field",
                }}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                className="form-field"
                InputLabelProps={{
                  className: "field-label",
                }}
                InputProps={{
                  className: "input-field",
                }}
              />
            </Box>

            <Box className="resume-section">
              <Typography variant="h6" gutterBottom className="section-title">
                Resume
              </Typography>
              <Box className="resume-content">
                {resume ? (
                  <Box className="current-resume">
                    <Button
                      variant="text"
                      onClick={() => setIsModalOpen(true)}
                      style={{ textTransform: "none" }}
                    >
                      View Resume
                    </Button>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={deleteResume}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography className="text-content">
                    No resume uploaded
                  </Typography>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  id="resume-input"
                  hidden
                  onChange={handleResumeChange}
                />
                <label htmlFor="resume-input">
                  <Button
                    component="span"
                    startIcon={<UploadIcon />}
                    variant="outlined"
                    className="upload-btn"
                  >
                    Upload Resume
                  </Button>
                </label>
              </Box>
            </Box>

            <Box className="action-buttons personal-info-actions">
              <Button
                variant="contained"
                color="primary"
                className="save-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Personal Info"}
              </Button>
              <Button
                variant="outlined"
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Grid>

        {/* Right Column - Password Change */}
        <Grid item xs={12} md={6} className="right-column">
          <Paper className="password-section">
            <Typography variant="h6" gutterBottom className="section-title">
              Change Password
            </Typography>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              variant="outlined"
              {...register("currentPassword")}
              className="form-field"
              InputLabelProps={{
                className: "field-label",
              }}
              InputProps={{
                className: "input-field",
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              {...register("newPassword")}
              className="form-field"
              InputLabelProps={{
                className: "field-label",
              }}
              InputProps={{
                className: "input-field",
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              variant="outlined"
              {...register("confirmPassword")}
              className="form-field"
              InputLabelProps={{
                className: "field-label",
              }}
              InputProps={{
                className: "input-field",
              }}
            />

            <Box className="action-buttons password-actions">
              <Button variant="contained" color="primary" className="save-btn">
                Change Password
              </Button>
              <Button variant="outlined" className="cancel-btn">
                Cancel
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Resume Modal */}
      {resume && (
        <ResumeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resumeUrl={resume}
        />
      )}
    </Box>
  );
};

export default ProfileSection;
