import type React from "react";
import { useState, useMemo, useEffect } from "react";
import "@sweetalert2/theme-default/default.css";

import "./SubscriptionModal.scss";
import axiosInstance from "../../../../utils/axiosConfig";
import Swal from "sweetalert2";
import { API_ENDPOINTS, someMessages } from "../../../../utils/constants";

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
    // No need to reset SweetAlert state
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
        console.error(someMessages.SUBS_FETCH_FAIL, error);
        showMessage(someMessages.SUBS_FETCH_FAIL);
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

  const showMessage = (
    message: string,
    icon: "success" | "error" | "warning" = "error"
  ) => {
    Swal.fire({
      title:
        icon === "success"
          ? "Success!"
          : icon === "warning"
          ? "Warning"
          : "Error",
      text: message,
      icon,
      toast: true,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const validateForm = () => {
    if (!name.trim()) {
      showMessage(someMessages.NAME_REQ);
      return false;
    }
    if (!description.trim()) {
      showMessage(someMessages.DESCRIPTION_RQ);
      return false;
    }
    if (!features.trim()) {
      showMessage(someMessages.ADD_FEATURE);
      return false;
    }
    if (!monthlyPrice || Number.parseFloat(monthlyPrice) <= 0) {
      showMessage(someMessages.PRICE_ERR);
      return false;
    }
    if (
      discount &&
      (Number.parseFloat(discount) < 0 ||
        Number.parseFloat(discount) >= Number.parseFloat(monthlyPrice))
    ) {
      showMessage(someMessages.DISCOUNT_ERR);
      return false;
    }
    if (discount && Number.parseFloat(discount) > 0 && !discountValidUntil) {
      showMessage(someMessages.DISCOUNT_DATE_ERR);
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
        price: Number.parseFloat(monthlyPrice),
        discountPrice: discount ? Number.parseFloat(discount) : undefined,
        discountValidUntil:
          discountValidUntil && Number.parseFloat(discount) > 0
            ? new Date(discountValidUntil)
            : undefined,
        isActive: true,
      };

      if (editMode && subscriptionId) {
        await axiosInstance.put(
          `/admin/update-subscription?id=${subscriptionId}`,
          subscriptionData
        );
        showMessage(someMessages.SUBS_UPDATE_SUCC, "success");
      } else {
        await axiosInstance.post(API_ENDPOINTS.SUBS_ADD, {
          ...subscriptionData,
          createdAt: new Date(),
        });
        showMessage(someMessages.SUBS_UPDATE_SUCC, "success");
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
      showMessage(
        error.response?.data?.message ||
          `Failed to ${editMode ? "update" : "create"} subscription`
      );
    }
  };

  const isDiscountValid = Number.parseFloat(discount) > 0;

  if (!isOpen) return null;

  return (
    <>
      <div className="subs-modal-overlay">
        <div className="subs-modal-content">
          <h2>{editMode ? "Edit" : "Add New"} Subscription</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="subs-form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="subs-form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="subs-form-group">
              <label htmlFor="features">Features (comma-separated)</label>
              <input
                type="text"
                id="features"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>
            <div className="subs-form-group">
              <label htmlFor="monthlyPrice">Monthly Price</label>
              <input
                type="number"
                id="monthlyPrice"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(e.target.value)}
              />
            </div>
            <div className="subs-form-group">
              <label htmlFor="discount">Discount Price</label>
              <input
                type="number"
                id="discount"
                value={discount}
                onChange={(e) => {
                  setDiscount(e.target.value);
                  if (
                    !e.target.value ||
                    Number.parseFloat(e.target.value) <= 0
                  ) {
                    setDiscountValidUntil("");
                  }
                }}
              />
            </div>
            <div className="subs-form-group">
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
            <div className="subs-button-group">
              <button type="submit" className="subs-submit-btn">
                {editMode ? "Update" : "Add"} Subscription
              </button>
              <button
                type="button"
                onClick={onClose}
                className="subs-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SubscriptionModal;
