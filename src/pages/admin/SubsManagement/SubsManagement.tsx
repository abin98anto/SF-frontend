import React, { useState } from "react";
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
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import AddSubscriptionModal from "./AddSubscription/AddSubscription";
import "./SubsManagement.scss";

interface Subscription {
  id: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  offerDiscount: number;
}

const subscriptions: Subscription[] = [
  {
    id: 1,
    name: "Basic",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    offerDiscount: 10,
  },
  {
    id: 2,
    name: "Pro",
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    offerDiscount: 15,
  },
  {
    id: 3,
    name: "Enterprise",
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    offerDiscount: 20,
  },
];

const SubsManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.id}</TableCell>
                <TableCell>{subscription.name}</TableCell>
                <TableCell>${subscription.monthlyPrice.toFixed(2)}</TableCell>
                <TableCell>${subscription.yearlyPrice.toFixed(2)}</TableCell>
                <TableCell>{subscription.offerDiscount}%</TableCell>
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
      </TableContainer>
      <AddSubscriptionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default SubsManagement;
