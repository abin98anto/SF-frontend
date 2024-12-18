import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Rating,
  Switch,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  fetchTutors,
  selectTutors,
  selectTutorsStatus,
  selectTutorsError,
} from "../../../redux/features/tutor/tutorListSlice";
import { toggleUserStatus } from "../../../redux/features/userSlice";
import ApproveTutorsModal from "./ApproveTutorModal/ApproveTutorModal";
import "./TutorManagement.scss";

const TutorManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const tutors = useAppSelector(selectTutors);
  const status = useAppSelector(selectTutorsStatus);
  const error = useAppSelector(selectTutorsError);
  const [approveModalOpen, setApproveModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTutors());
  }, [dispatch]);

  const handleStatusToggle = async (id: string) => {
    try {
      await dispatch(toggleUserStatus(id)).unwrap();
      dispatch(fetchTutors());
    } catch (error) {
      console.error("Failed to toggle user status", error);
    }
  };

  const handleApprove = () => {
    setApproveModalOpen(true);
  };

  const activeTutors = tutors.filter((tutor) => tutor.isActive === true);
  const pendingTutors = tutors.filter((tutor) => tutor.isActive !== true);

  return (
    <div className="tutor-management">
      <h1 className="tutor-heading">Tutor Management</h1>

      <div className="header-section">
        <h2 className="tutor-heading">Teachers List</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={handleApprove}
          className="approve-button"
        >
          Approve Tutors
        </Button>
      </div>

      <TableContainer component={Paper} className="table-container">
        {status === "loading" ? (
          <div className="loading-placeholder">
            <CircularProgress />
          </div>
        ) : status === "failed" ? (
          <div className="error-placeholder">
            <Typography variant="h6" color="error">
              Error: {error || "Failed to fetch tutors"}
            </Typography>
          </div>
        ) : activeTutors.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Ratings</TableCell>
                <TableCell>No. of batches handling</TableCell>
                <TableCell>Reviews Taken</TableCell>
                <TableCell>Sessions Taken</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeTutors.map((tutor) => (
                <TableRow key={tutor._id} className="active">
                  <TableCell>{tutor.name}</TableCell>
                  <TableCell>{tutor.email}</TableCell>
                  <TableCell>{tutor.role}</TableCell>
                  <TableCell>
                    <Rating value={tutor.rating} readOnly precision={0.5} />
                  </TableCell>
                  <TableCell>{tutor.batchesHandling}</TableCell>
                  <TableCell>{tutor.reviewsTaken}</TableCell>
                  <TableCell>{tutor.sessionsTaken}</TableCell>
                  <TableCell>
                    <span className="status-badge active">Active</span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={tutor.isActive === true}
                      onChange={() => handleStatusToggle(tutor._id)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="no-data-placeholder">
            <Typography variant="h6" color="textSecondary">
              No active tutors available
            </Typography>
            <Typography variant="body2" color="textSecondary">
              There are currently no active tutors in the system. Active tutors
              will appear here once added.
            </Typography>
          </div>
        )}
      </TableContainer>

      <ApproveTutorsModal
        open={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        pendingTutors={pendingTutors}
      />
    </div>
  );
};

export default TutorManagement;
