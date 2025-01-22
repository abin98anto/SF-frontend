import type React from "react";
import { useState, useEffect, useMemo } from "react";
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";

import { useAppDispatch } from "../../../hooks/hooks";
import {
  getUsers,
  toggleUserStatus,
} from "../../../redux/services/UserManagementServices";
import type { UserDetails } from "../../../entities/user/UserDetails";
import { UserRole } from "../../../entities/user/UserRole";
import { someMessages } from "../../../utils/constants";
import type { AppRootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import "./UserManagement.scss"

interface Subscription {
  isActive: any;
  _id: string;
  name: string;
}

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  const [users, setUsers] = useState<UserDetails[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("all");

  const { isAuthenticated } = useSelector(
    (state: AppRootState) => state.adminLogin
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
    fetchUsers();
    fetchSubscriptions();
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

  const fetchSubscriptions = async () => {
    try {
      const response = await axiosInstance.get("/admin/subscriptions");
      const result = response.data.data.filter(
        (subs: Subscription) => subs.isActive !== false
      );
      setSubscriptions(result as Subscription[]);
    } catch (err) {
      console.log("Failed to fetch subscriptions", err);
      setError("Failed to fetch subscriptions");
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(
        (user) =>
          user.name!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email!.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((user) => {
        if (sortBy === "all") return true;
        if (sortBy === "free") return !user.subscription;
        return user.subscription?.name.toLowerCase() === sortBy.toLowerCase();
      })
      .sort((a, b) => {
        const subscriptionA = a.subscription?.name || "Free";
        const subscriptionB = b.subscription?.name || "Free";
        return subscriptionA.localeCompare(subscriptionB);
      });
  }, [users, searchTerm, sortBy]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-management">
      <div className="header-section">
        <Typography variant="h4" className="title">
          User Management
        </Typography>
        
        <div className="controls">
          <TextField
            label="Search users"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              width: 300,
              backgroundColor: '#fff',
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

          <FormControl sx={{ width: 200 }} size="small">
            <InputLabel>Filter by</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Filter by"
              sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
              }}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="free">Free Tier</MenuItem>
              {subscriptions.map((subscription) => (
                <MenuItem
                  key={subscription._id}
                  value={subscription.name.toLowerCase()}
                >
                  {subscription.name} Plan
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Sl No.</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Subscription</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedUsers.map((user, index) => (
              <TableRow 
                key={user._id}
                sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="subscription-badge">
                    {user.subscription?.name || 'Free'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={user.isActive ? 'error' : 'success'}
                    size="small"
                    onClick={() =>
                      handleOpenDialog(
                        user._id as string,
                        user.isActive ? 'block' : 'unblock'
                      )
                    }
                    sx={{
                      textTransform: 'none',
                      borderRadius: '6px',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    {user.isActive ? 'Block User' : 'Unblock User'}
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
    </div>
  );
};

export default UserManagement;
