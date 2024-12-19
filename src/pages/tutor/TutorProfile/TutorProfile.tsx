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
} from "@mui/icons-material";
import { updateUser } from "../../../redux/services/userUpdateService";
import { RootState } from "../../../redux/store";
import "./TutorProfile.scss";
import { uploadToCloudinary } from "../../../utils/cloudinary";

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Get user info from Redux state
  const { loading, tutorInfo } = useSelector(
    (state: RootState) => state.userLogin
  );

  const [profileImage, setProfileImage] = useState<string | null>(
    tutorInfo?.profilePicture || "/default-avatar.png"
  );
  const [resume, setResume] = useState<string | null>(
    tutorInfo?.resume || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProfileFormData>();

  // Populate form with user data when component mounts or userInfo changes
  // useEffect(() => {
  //   if (tutorInfo) {
  //     setValue("name", tutorInfo.name || "");
  //     setValue("email", tutorInfo.email || "");

  //     // Update profile image if exists
  //     if (tutorInfo.profilePicture) {
  //       setProfileImage(tutorInfo.profilePicture);
  //     }

  //     // Update resume if exists
  //     if (tutorInfo.resume) {
  //       setResume(tutorInfo.resume);
  //     }
  //   }
  // }, [tutorInfo, setValue]);
  useEffect(() => {
    if (tutorInfo) {
      setValue("name", tutorInfo.name || "");
      setValue("email", tutorInfo.email || "");
      setProfileImage(tutorInfo.profilePicture || "/default-avatar.png");
    }
  }, [tutorInfo, setValue]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadedImageUrl = await uploadToCloudinary(file);
      setProfileImage(uploadedImageUrl);

      // Update tutor info with the new profile picture
      await dispatch(updateUser({ profilePicture: uploadedImageUrl })).unwrap();

      setUpdateSuccess(true);
      setUpdateError(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUpdateError("Failed to upload image");
    }
  };

  const onSubmitPersonalInfo = async (data: ProfileFormData) => {
    try {
      console.log("first", data);
      setUpdateError(null);
      setUpdateSuccess(false);

      const updateData = {
        name: data.name,
        email: data.email,
      };

      let res = await dispatch(updateUser(data)).unwrap();
      console.log("resullt s", res);
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateError(
        typeof error === "string" ? error : "Failed to update profile"
      );
    }
  };

  const handleCancel = () => {
    // Reset form to initial user data
    if (tutorInfo) {
      setValue("name", tutorInfo.name || "");
      setValue("email", tutorInfo.email || "");
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
              onChange={handleImageChange} // Handle image upload
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
              onClick={() => setProfileImage("/default-avatar.png")} // Reset to default avatar
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
                    <Typography className="text-content">
                      Current Resume: {resume.split("/").pop()}
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
    </Box>
  );
};

export default ProfileSection;
