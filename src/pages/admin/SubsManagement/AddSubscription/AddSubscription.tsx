import React, { useState } from "react";
import "./AddSubscription.scss";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [yearlyPrice, setYearlyPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountValidUntil, setDiscountValidUntil] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      name,
      description,
      features: features.split(",").map((feature) => feature.trim()),
      pricing: {
        monthly: parseFloat(monthlyPrice),
        yearly: parseFloat(yearlyPrice),
      },
      discount: discount ? parseFloat(discount) : undefined,
      discountValidUntil: discountValidUntil
        ? new Date(discountValidUntil)
        : undefined,
      isActive: true,
      createdAt: new Date(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Subscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="features">Features (comma-separated)</label>
            <input
              type="text"
              id="features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="monthlyPrice">Monthly Price</label>
            <input
              type="number"
              id="monthlyPrice"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="yearlyPrice">Yearly Price</label>
            <input
              type="number"
              id="yearlyPrice"
              value={yearlyPrice}
              onChange={(e) => setYearlyPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="discountValidUntil">Discount Valid Until</label>
            <input
              type="date"
              id="discountValidUntil"
              value={discountValidUntil}
              onChange={(e) => setDiscountValidUntil(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-btn">
              Add Subscription
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
