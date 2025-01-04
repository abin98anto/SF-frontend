import React, { useState, useMemo, useEffect } from "react";
import "./SubscriptionModal.scss";
import axiosInstance from "../../../../utils/axiosConfig";
import { Snackbar } from "../../../../components/Snackbar/Snackbar";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionChange: () => void;
  editMode?: boolean;
  subscriptionId?: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscriptionChange,
  editMode = false,
  subscriptionId,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountValidUntil, setDiscountValidUntil] = useState("");
  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    message: "",
  });

  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  const resetFields = () => {
    setName("");
    setDescription("");
    setFeatures("");
    setMonthlyPrice("");
    setDiscount("");
    setDiscountValidUntil("");
    setSnackbar({ isVisible: false, message: "" });
  };

  const fetchSubscriptionDetails = async () => {
    if (editMode && subscriptionId) {
      try {
        const response = await axiosInstance.get(
          `/admin/subscription-details?id=${subscriptionId}`
        );
        const subscription = response.data.data;
        setName(subscription.name);
        setDescription(subscription.description);
        setFeatures(subscription.features.join(", "));
        setMonthlyPrice(subscription.price.toString());
        setDiscount(subscription.discountPrice?.toString() || "");
        setDiscountValidUntil(
          subscription.discountValidUntil
            ? new Date(subscription.discountValidUntil)
                .toISOString()
                .split("T")[0]
            : ""
        );
      } catch (error) {
        console.error("Failed to fetch subscription details:", error);
        showError("Failed to load subscription details");
      }
    }
  };

  useEffect(() => {
    if (isOpen && editMode && subscriptionId) {
      fetchSubscriptionDetails();
    } else if (!isOpen) {
      resetFields();
    }
  }, [isOpen, editMode, subscriptionId]);

  const showError = (message: string) => {
    setSnackbar({
      isVisible: true,
      message,
    });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const validateForm = () => {
    if (!name.trim()) {
      showError("Name is required");
      return false;
    }
    if (!description.trim()) {
      showError("Description is required");
      return false;
    }
    if (!features.trim()) {
      showError("At least one feature is required");
      return false;
    }
    if (!monthlyPrice || parseFloat(monthlyPrice) <= 0) {
      showError("Monthly price must be greater than 0");
      return false;
    }
    if (
      discount &&
      (parseFloat(discount) < 0 ||
        parseFloat(discount) >= parseFloat(monthlyPrice))
    ) {
      showError("Discount must be above 0 and less than monthly price");
      return false;
    }
    if (discount && parseFloat(discount) > 0 && !discountValidUntil) {
      showError("Please specify discount validity period");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const subscriptionData = {
        name,
        description,
        features: features.split(",").map((feature) => feature.trim()),
        price: parseFloat(monthlyPrice),
        discountPrice: discount ? parseFloat(discount) : undefined,
        discountValidUntil:
          discountValidUntil && parseFloat(discount) > 0
            ? new Date(discountValidUntil)
            : undefined,
        isActive: true,
      };

      if (editMode && subscriptionId) {
        await axiosInstance.put(
          `/admin/update-subscription?id=${subscriptionId}`,
          subscriptionData
        );
        setSnackbar({
          isVisible: true,
          message: "Subscription updated successfully",
        });
      } else {
        await axiosInstance.post("/admin/create-subscription", {
          ...subscriptionData,
          createdAt: new Date(),
        });
        setSnackbar({
          isVisible: true,
          message: "Subscription created successfully",
        });
      }

      setTimeout(() => {
        onSubscriptionChange();
        resetFields();
      }, 1000);
    } catch (error: any) {
      console.error(
        `Failed to ${editMode ? "update" : "create"} subscription:`,
        error
      );
      showError(
        error.response?.data?.message ||
          `Failed to ${editMode ? "update" : "create"} subscription`
      );
    }
  };

  const isDiscountValid = parseFloat(discount) > 0;

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{editMode ? "Edit" : "Add New"} Subscription</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="features">Features (comma-separated)</label>
              <input
                type="text"
                id="features"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="monthlyPrice">Monthly Price</label>
              <input
                type="number"
                id="monthlyPrice"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="discount">Discount Price</label>
              <input
                type="number"
                id="discount"
                value={discount}
                onChange={(e) => {
                  setDiscount(e.target.value);
                  if (!e.target.value || parseFloat(e.target.value) <= 0) {
                    setDiscountValidUntil("");
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="discountValidUntil">Discount Valid Until</label>
              <input
                type="date"
                id="discountValidUntil"
                value={discountValidUntil}
                onChange={(e) => setDiscountValidUntil(e.target.value)}
                min={minDate}
                disabled={!isDiscountValid}
                style={{
                  backgroundColor: !isDiscountValid ? "#f5f5f5" : "white",
                  cursor: !isDiscountValid ? "not-allowed" : "pointer",
                }}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="submit-btn">
                {editMode ? "Update" : "Add"} Subscription
              </button>
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Snackbar
        message={snackbar.message}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
    </>
  );
};

export default SubscriptionModal;
