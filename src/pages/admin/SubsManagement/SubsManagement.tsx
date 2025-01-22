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
  Switch,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";

import SubscriptionModal from "./SubscriptionModal/SubscriptionModal";
import "./SubsManagement.scss";
import axiosInstance from "../../../utils/axiosConfig";
import SubscriptionPlan from "../../../entities/subscription/subscription";
import { API_ENDPOINTS, someMessages } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { AppRootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

const SubsManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<
    string | null
  >(null);
  const [editMode, setEditMode] = useState(false);
  const [currentToggleStatus, setCurrentToggleStatus] =
    useState<boolean>(false);

  const handleOpenModal = (mode: "add" | "edit", subscriptionId?: string) => {
    setEditMode(mode === "edit");
    setSelectedSubscription(subscriptionId || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setSelectedSubscription(null);
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SUBS);
      setSubscriptions(response.data.data);
    } catch (error) {
      console.error(someMessages.SUBS_FETCH_FAIL, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscriptionChange = async () => {
    await fetchSubscriptions();
    handleCloseModal();
  };

  const handleToggleClick = (subscriptionId: string, isActive: boolean) => {
    setSelectedSubscription(subscriptionId);
    setCurrentToggleStatus(isActive);
    setToggleModalOpen(true);
  };

  const handleCloseToggleModal = () => {
    setToggleModalOpen(false);
    setSelectedSubscription(null);
  };

  const handleConfirmToggle = async () => {
    if (!selectedSubscription) return;

    try {
      await axiosInstance.put(
        `/admin/delete-subscription?id=${selectedSubscription}`,
        {
          isActive: !currentToggleStatus,
        }
      );
      await fetchSubscriptions(); // Refresh the list after toggling
      handleCloseToggleModal();
    } catch (error) {
      console.error("Failed to toggle subscription status:", error);
    }
  };

  const { isAuthenticated } = useSelector(
    (state: AppRootState) => state.adminLogin
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
    fetchSubscriptions();
  }, [isAuthenticated]);

  return (
    <div className="subs-management">
      <div className="header">
        <h1>Subscription Management</h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenModal("add")}
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
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((subscription, index) => (
                <TableRow key={subscription._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{subscription.name}</TableCell>
                  <TableCell>${subscription.price}</TableCell>
                  <TableCell>
                    {subscription.discountPrice
                      ? `$${subscription.discountPrice}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={subscription.isActive}
                      onChange={() =>
                        handleToggleClick(
                          subscription._id!,
                          subscription.isActive!
                        )
                      }
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      aria-label="edit"
                      onClick={() => handleOpenModal("edit", subscription._id)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Toggle Confirmation Modal */}
      <Dialog
        open={toggleModalOpen}
        onClose={handleCloseToggleModal}
        aria-labelledby="toggle-dialog-title"
      >
        <DialogTitle id="toggle-dialog-title">
          Confirm {currentToggleStatus ? "Unlist" : "List"} Subscription
        </DialogTitle>
        <DialogContent>
          Are you sure you want to {currentToggleStatus ? "unlist" : "list"}{" "}
          this subscription?
          <br />
          This action{" "}
          {currentToggleStatus
            ? "will make the subscription inactive."
            : "will make the subscription active."}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseToggleModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmToggle} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubscriptionChange={handleSubscriptionChange}
        editMode={editMode}
        subscriptionId={selectedSubscription || undefined}
      />
    </div>
  );
};

export default SubsManagement;
