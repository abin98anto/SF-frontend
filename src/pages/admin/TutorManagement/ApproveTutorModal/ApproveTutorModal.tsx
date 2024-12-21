import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  DialogContentText,
} from "@mui/material";
import { useAppDispatch } from "../../../../hooks/hooks";
import { getUsers } from "../../../../redux/services/UserManagementServices";
import { UserDetails } from "../../../../entities/user/UserDetails";
import { UserRole } from "../../../../entities/user/UserRole";
import { verifyTutor } from "../../../../redux/services/TutorManagement";

interface ApproveTutorsModalProps {
  open: boolean;
  onClose: () => void;
  onTutorApproved: () => void; // Add this prop
}

const ApproveTutorsModal: React.FC<ApproveTutorsModalProps> = ({
  open,
  onClose,
  onTutorApproved,
}) => {
  const dispatch = useAppDispatch();

  const [unverifiedTutors, setUnverifiedTutors] = useState<UserDetails[]>([]);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (open) {
      fetchUnverifiedTutors();
    }
  }, [open]);

  const fetchUnverifiedTutors = async () => {
    try {
      const response = await dispatch(getUsers(UserRole.TUTOR));
      const unverified = (response.payload as UserDetails[]).filter(
        (tutor) => !tutor.isVerified
      );
      setUnverifiedTutors(unverified);
    } catch (err) {
      console.error("Error fetching unverified tutors", err);
    }
  };

  const handleViewResume = (resumeLink: string) => {
    setResumeUrl(resumeLink);
    setResumeModalOpen(true);
  };

  const handleCloseResumeModal = () => {
    setResumeModalOpen(false);
    setResumeUrl(null);
  };

  const handleApproveClick = (tutor: UserDetails) => {
    setSelectedTutor(tutor);
    setConfirmModalOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (selectedTutor?._id) {
      try {
        // console.log("selected user", selectedTutor);
        await dispatch(
          verifyTutor({
            _id: selectedTutor._id,
            isVerified: true,
          })
        );
        // Refresh the tutor list after approval
        await fetchUnverifiedTutors();
        onTutorApproved();
      } catch (error) {
        console.error("Error approving tutor:", error);
      }
    }
    setConfirmModalOpen(false);
    setSelectedTutor(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Approve Tutors</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sl No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unverifiedTutors.map((tutor, index) => (
                  <TableRow key={tutor._id || `tutor-${index}`}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{tutor.name}</TableCell>
                    <TableCell>{tutor.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewResume(tutor.resume as string)}
                        style={{ marginRight: 8 }}
                      >
                        View Resume
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: 8 }}
                        onClick={() => handleApproveClick(tutor)}
                      >
                        Approve
                      </Button>
                      <Button variant="contained" color="error">
                        Deny
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resume Modal */}
      <Dialog
        open={resumeModalOpen}
        onClose={handleCloseResumeModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Resume</DialogTitle>
        <DialogContent>
          {resumeUrl ? (
            <iframe
              src={resumeUrl}
              title="Tutor Resume"
              style={{ width: "100%", height: "500px" }}
              frameBorder="0"
            ></iframe>
          ) : (
            <p>Loading resume...</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResumeModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      >
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve {selectedTutor?.name} as a tutor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmApproval}
            color="success"
            variant="contained"
          >
            Yes, Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApproveTutorsModal;
