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
} from "@mui/material";
import { useAppDispatch } from "../../../../hooks/hooks";
import { getUsers } from "../../../../redux/services/UserManagementServices";
import { UserDetails } from "../../../../entities/user/UserDetails";
import { UserRole } from "../../../../entities/user/UserRole";
import { updateUser } from "../../../../redux/services/userUpdateService";

interface ApproveTutorsModalProps {
  open: boolean;
  onClose: () => void;
}

const ApproveTutorsModal: React.FC<ApproveTutorsModalProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const [unverifiedTutors, setUnverifiedTutors] = useState<UserDetails[]>([]);

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

  const handleApproveTutor = async (tutorId: string) => {
    try {
      await dispatch(updateUser({ _id: tutorId, isVerified: true })).unwrap();
      setUnverifiedTutors((prevTutors) =>
        prevTutors.filter((tutor) => tutor._id !== tutorId)
      );
    } catch (err) {
      console.error("Error approving tutor", err);
    }
  };

  return (
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
                      onClick={() => console.log("View Resume clicked")}
                      style={{ marginRight: 8 }}
                    >
                      View Resume
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApproveTutor(tutor._id as string)}
                      style={{ marginRight: 8 }}
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
  );
};

export default ApproveTutorsModal;
