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
import { someMessages } from "../../../utils/constants";
import { AppRootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");

  const { isAuthenticated } = useSelector(
    (state: AppRootState) => state.adminLogin
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await dispatch(getUsers(UserRole.USER));
      setUsers(response.payload as UserDetails[]);
      setLoading(false);
    } catch (err) {
      console.log(someMessages.USERS_FETCH_FAIL, err);
      setError(someMessages.USERS_FETCH_FAIL);
      setLoading(false);
    }
  };

  const handleToggleActiveState = async () => {
    if (!selectedUserId) return;

    try {
      const result = await dispatch(toggleUserStatus(selectedUserId)).unwrap();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === result ? { ...user, isActive: !user.isActive } : user
        )
      );

      setIsDialogOpen(false);
    } catch (error) {
      console.error(someMessages.USER_TOOGLE_FAIL, error);
    }
  };

  const handleOpenDialog = (userId: string, action: string) => {
    setSelectedUserId(userId);
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUserId(null);
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
        <h1>User Management</h1>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subscription Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id || `user-${index}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.subscription?.name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={user.isActive ? "primary" : "secondary"}
                    onClick={() =>
                      handleOpenDialog(
                        user._id as string,
                        user.isActive ? "block" : "unblock"
                      )
                    }
                  >
                    {user.isActive ? "Block" : "Unblock"}
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
            Are you sure you want to {dialogAction} this user?
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
    </>
  );
};

export default UserManagement;
