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

interface Subscription {
  _id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  discountPrice?: number;
  discountValidUntil?: Date;
  isActive: boolean;
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
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountValidUntil, setDiscountValidUntil] = useState("");
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);

  const featureOptions = [
    "Browse Courses",
    "View Syllabus",
    "Take any course",
    "Chat with tutor",
    "1 on 1 session with tutor",
    "Get certified",
  ];

  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  const resetFields = () => {
    setName("");
    setDescription("");
    setSelectedFeatures([]);
    setMonthlyPrice("");
    setDiscount("");
    setDiscountValidUntil("");
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
        setSelectedFeatures(subscription.features);
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

  const fetchAllSubscriptions = async () => {
    try {
      const response = await axiosInstance.get("/admin/subscriptions");
      setAllSubscriptions(response.data.data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      showMessage("Failed to fetch subscriptions");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllSubscriptions();
      if (editMode && subscriptionId) {
        fetchSubscriptionDetails();
      }
    } else {
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

  const isNameUnique = (name: string) => {
    return !allSubscriptions.some(
      (sub) =>
        sub.name.toLowerCase() === name.toLowerCase() &&
        sub._id !== subscriptionId
    );
  };

  const validateForm = () => {
    if (!name.trim()) {
      showMessage(someMessages.NAME_REQ);
      return false;
    }
    if (!isNameUnique(name)) {
      showMessage("Subscription name must be unique.");
      return false;
    }
    if (!description.trim()) {
      showMessage(someMessages.DESCRIPTION_RQ);
      return false;
    }
    if (selectedFeatures.length === 0) {
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

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Set discountPrice to 0 if the discount input is empty
      const discountPrice = discount ? Number.parseFloat(discount) : 0;

      const subscriptionData = {
        name,
        description,
        features: selectedFeatures,
        price: Number.parseFloat(monthlyPrice),
        discountPrice: discountPrice, // Use the calculated discountPrice
        discountValidUntil:
          discountPrice > 0 && discountValidUntil
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
              <label>Features</label>
              <div className="subs-features-checkbox-group">
                {featureOptions.map((feature) => (
                  <label key={feature} className="subs-feature-checkbox">
                    <input
                      type="checkbox"
                      value={feature}
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                    />
                    {feature}
                  </label>
                ))}
              </div>
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
