import React from "react";
import { Modal, Paper, Typography, Button } from "@mui/material";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Paper className="confirmation-modal">
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {message}
        </Typography>
        <div className="button-group">
          <Button variant="outlined" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Yes
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};

export default ConfirmationModal;
