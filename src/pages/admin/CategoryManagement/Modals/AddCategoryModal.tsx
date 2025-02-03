import React, { useState } from "react";
import { X } from "lucide-react";

import "./AddCategoryModal.scss";
import axiosInstance from "../../../../utils/axiosConfig";
import { API_ENDPOINTS, someMessages } from "../../../../utils/constants";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryAdded,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post(API_ENDPOINTS.ADD_CAT, { name: categoryName });
      onCategoryAdded();
      onClose();
      setCategoryName("");
    } catch (err) {
      setError(someMessages.ADD_CAT_FAIL);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="catm-modal-overlay">
      <div className="catm-modal-content">
        <div className="catm-modal-header">
          <h2>Add New Category</h2>
          <button onClick={onClose} className="catm-close-button">
            <X />
          </button>
        </div>
        <form className="catm-modal-form" onSubmit={handleSubmit}>
          <div className="catm-form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              placeholder="Enter category name"
            />
          </div>
          {error && <div className="catm-error-message">{error}</div>}
          <div className="catm-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="catm-cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="catm-add-button"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
