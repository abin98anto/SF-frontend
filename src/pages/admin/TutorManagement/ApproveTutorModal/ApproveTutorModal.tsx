import React from "react";
import {
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import ConfirmationModal from "./ConfirmModal";
import { useAppDispatch } from "../../../../hooks/hooks";
import { toggleUserStatus } from "../../../../redux/features/user/userSlice";
import { UserDetails } from "../../../../entities/user/UserDetails";

interface ApproveTutorsModalProps {
  open: boolean;
  onClose: () => void;
  pendingTutors: UserDetails[];
}

const ApproveTutorsModal: React.FC<ApproveTutorsModalProps> = ({
  open,
  onClose,
  pendingTutors,
}) => {
  const dispatch = useAppDispatch();
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);
  const [selectedTutor, setSelectedTutor] = React.useState<UserDetails | null>(
    null
  );

  const handleVerify = (tutor: UserDetails) => {
    setSelectedTutor(tutor);
    setConfirmationOpen(true);
  };

  const handleConfirmVerify = () => {
    if (typeof selectedTutor?.id === "string") {
      dispatch(toggleUserStatus(selectedTutor.id));
    }
    setConfirmationOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Paper className="approve-tutors-modal">
          <Typography variant="h6" component="h2" gutterBottom>
            Approve Tutors
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Resume</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingTutors.map((tutor) => (
                  <TableRow key={tutor.id}>
                    <TableCell>{tutor.name}</TableCell>
                    <TableCell>{tutor.email}</TableCell>
                    <TableCell>
                      {tutor.resume ? (
                        <a
                          href={tutor.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </a>
                      ) : (
                        "No Resume"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleVerify(tutor)}
                      >
                        Verify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Modal>
      <ConfirmationModal
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmVerify}
        title="Verify Tutor"
        message={`Are you sure you want to verify ${selectedTutor?.name}?`}
      />
    </>
  );
};

export default ApproveTutorsModal;
