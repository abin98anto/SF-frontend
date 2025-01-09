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
import {
  getUsers,
  denyTutor,
} from "../../../../redux/services/UserManagementServices";
import { UserDetails } from "../../../../entities/user/UserDetails";
import { UserRole } from "../../../../entities/user/UserRole";
import { verifyTutor } from "../../../../redux/services/TutorManagement";
import { someMessages } from "../../../../utils/constants";

interface ApproveTutorsModalProps {
  open: boolean;
  onClose: () => void;
  onTutorApproved: () => void;
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
  const [denyModalOpen, setDenyModalOpen] = useState(false);
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
      console.error(someMessages.UNV_TUTORS_FETCH_FAIL, err);
    }
  };

  const handleViewResume = (resumeLink: string | undefined) => {
    setResumeUrl(resumeLink || null);
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

  const handleDenyClick = (tutor: UserDetails) => {
    setSelectedTutor(tutor);
    setDenyModalOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (selectedTutor?._id) {
      try {
        await dispatch(
          verifyTutor({
            _id: selectedTutor._id,
            isVerified: true,
          })
        );
        await fetchUnverifiedTutors();
        onTutorApproved();
      } catch (error) {
        console.error(someMessages.APPROVE_TUTOR_FAIL, error);
      }
    }
    setConfirmModalOpen(false);
    setSelectedTutor(null);
  };

  const handleConfirmDenial = async () => {
    if (selectedTutor?._id) {
      try {
        await dispatch(denyTutor(selectedTutor._id as string));
        await fetchUnverifiedTutors();
        onTutorApproved();
      } catch (error) {
        console.error(someMessages.DENY_TUTOR_FAIL, error);
      }
    }
    setDenyModalOpen(false);
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
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDenyClick(tutor)}
                      >
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
            <DialogContentText style={{ textAlign: "center", padding: "2rem" }}>
              The tutor has not uploaded their resume yet.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResumeModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approval Confirmation Modal */}
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

      {/* Denial Confirmation Modal */}
      <Dialog open={denyModalOpen} onClose={() => setDenyModalOpen(false)}>
        <DialogTitle>Confirm Denial</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deny {selectedTutor?.name}'s request to
            become a tutor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDenyModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDenial}
            color="error"
            variant="contained"
          >
            Yes, Deny
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApproveTutorsModal;
