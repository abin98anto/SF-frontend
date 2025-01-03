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
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import AddSubscriptionModal from "./AddSubscription/AddSubscription";
import "./SubsManagement.scss";
import axiosInstance from "../../../utils/axiosConfig";
import SubscriptionPlan from "../../../entities/subscription/subscription";

const SubsManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<
    string | null
  >(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axiosInstance.get("/admin/subscriptions");
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscriptionAdded = async () => {
    await fetchSubscriptions();
    setIsModalOpen(false);
  };

  const handleDeleteClick = (subscriptionId: string) => {
    setSelectedSubscription(subscriptionId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedSubscription(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSubscription) return;

    try {
      await axiosInstance.delete(
        `/admin/delete-subscription?id=${selectedSubscription}`
      );
      await fetchSubscriptions();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete subscription:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="subs-management">
      <div className="header">
        <h1>Subscription Management</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenModal}
        >
          Add New Subscription
        </Button>
      </div>
      <TableContainer component={Paper}>
        {isLoading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Monthly Price</TableCell>
                <TableCell>Discount Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((subscription, index) => (
                <TableRow key={subscription._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{subscription.name}</TableCell>
                  <TableCell>${subscription.price}</TableCell>
                  <TableCell>{subscription.discountPrice}</TableCell>
                  <TableCell>
                    <IconButton color="primary" aria-label="edit">
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(subscription._id!)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this subscription?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubscriptionAdded={handleSubscriptionAdded}
      />
    </div>
  );
};

export default SubsManagement;
