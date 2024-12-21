import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAppDispatch } from "../../../hooks/hooks";
import {
  getUsers,
  toggleUserStatus,
} from "../../../redux/services/UserManagementServices";
import { UserDetails } from "../../../entities/user/UserDetails";
import { UserRole } from "../../../entities/user/UserRole";
import ApproveTutorsModal from "./ApproveTutorModal/ApproveTutorModal";

const TutorManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  const [tutors, setTutors] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const handleOpenApproveModal = () => setIsApproveModalOpen(true);
  const handleCloseApproveModal = () => setIsApproveModalOpen(false);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await dispatch(getUsers(UserRole.TUTOR));
      const verifiedTutors = (response.payload as UserDetails[]).filter(
        (tutor) => tutor.isVerified
      );
      setTutors(verifiedTutors);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching tutors", err);
      setError("Error fetching tutors. Please try again later.");
      setLoading(false);
    }
  };

  const handleToggleActiveState = async () => {
    if (!selectedTutorId) return;

    try {
      const result = await dispatch(toggleUserStatus(selectedTutorId)).unwrap();

      setTutors((prevTutors) =>
        prevTutors.map((tutor) =>
          tutor._id === result ? { ...tutor, isActive: !tutor.isActive } : tutor
        )
      );

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to toggle tutor state", error);
    }
  };

  const handleOpenDialog = (tutorId: string, action: string) => {
    setSelectedTutorId(tutorId);
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTutorId(null);
    setDialogAction("");
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <h1>Tutor Management</h1>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "10px 0" }}
          onClick={handleOpenApproveModal}
        >
          Approve Tutors
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subscription Type</TableCell>
              <TableCell>Sessions Taken</TableCell>
              <TableCell>Students Count</TableCell>
              <TableCell>Joining Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tutors.map((tutor, index) => (
              <TableRow key={tutor._id || `tutor-${index}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{tutor.name}</TableCell>
                <TableCell>{tutor.email}</TableCell>
                <TableCell>{tutor.dateJoined}</TableCell>
                <TableCell>{tutor.sessionsTaken}</TableCell>
                <TableCell>{tutor.students?.length}</TableCell>
                <TableCell>{tutor.dateJoined}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={tutor.isActive ? "primary" : "secondary"}
                    onClick={() =>
                      handleOpenDialog(
                        tutor._id as string,
                        tutor.isActive ? "block" : "unblock"
                      )
                    }
                  >
                    {tutor.isActive ? "Unblock" : "Block"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">
          Confirm {dialogAction === "block" ? "Block" : "Unblock"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {dialogAction} this tutor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleToggleActiveState} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ApproveTutorsModal
        open={isApproveModalOpen}
        onClose={handleCloseApproveModal}
      />
    </>
  );
};

export default TutorManagement;
