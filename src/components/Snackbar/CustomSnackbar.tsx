import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          whiteSpace: "pre-line",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;

/*

How to use:
1. Import useSnackbar and CustomSnackbar to the component.
    import { useSnackbar } from "../../../hooks/useSnackbar";
    import CustomSnackbar from "../common/CustomSnackbar";

2. Deconstruct the snackbar, showSnackbar and hidsnackbar from useSnackbar.
    const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

3. At the end of the component place the CustomSnackbar element.
    <CustomSnackbar
      open={snackbar.open}
      message={snackbar.message}
      severity={snackbar.severity}
      onClose={hideSnackbar}
    />

4. Apply snackbar in where needed.
    showSnackbar(what_to_display_in_snackbar, "error" or "success");
  
*/
