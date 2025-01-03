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
                <TableCell>Yearly Price</TableCell>
                <TableCell>Offer Discount</TableCell>
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
                    <IconButton color="secondary" aria-label="delete">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <AddSubscriptionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default SubsManagement;
