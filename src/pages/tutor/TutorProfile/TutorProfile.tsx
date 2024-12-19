import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSection = () => {
  const [profileImage, setProfileImage] = useState<string | null>(
    "/default-avatar.png"
  );
  const [resume, setResume] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>();

  return (
    <Box className="profile-section">
      <Typography variant="h4" className="profile-header">
        Profile Settings
      </Typography>

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
            <IconButton color="error" size="small" className="delete-photo-btn">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Two Column Layout */}
      <Grid container spacing={4} className="main-content">
        {/* Left Column - Basic Info and Resume */}
        <Grid item xs={12} md={6} className="left-column">
          <Box className="basic-info-section">
            <Typography variant="h6" gutterBottom className="section-title">
              Personal Information
            </Typography>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              {...register("name")}
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
              {...register("email")}
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
                  <Typography className="text-content">
                    Current Resume: resume.pdf
                  </Typography>
                  <IconButton color="error" size="small">
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

          {/* Personal Info Action Buttons */}
          <Box className="action-buttons personal-info-actions">
            <Button variant="contained" color="primary" className="save-btn">
              Save Personal Info
            </Button>
            <Button variant="outlined" className="cancel-btn">
              Cancel
            </Button>
          </Box>
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

            {/* Password Change Action Buttons */}
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
    </Box>
  );
};

export default ProfileSection;
