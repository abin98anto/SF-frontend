import { useState, useEffect } from "react";
import axiosInstance from "../../../../utils/axiosConfig";
import { ICategory } from "../../../../entities/categories/ICategories";
import "./EditCategoryModal.scss";
import { API_ENDPOINTS, someMessages } from "../../../../utils/constants";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryEdited: () => void;
  category: ICategory | null;
}

const EditCategoryModal = ({
  isOpen,
  onClose,
  onCategoryEdited,
  category,
}: EditCategoryModalProps) => {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIsActive(category.isActive);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await axiosInstance.patch(API_ENDPOINTS.UPDATE_CAT, {
        _id: category?._id,
        name,
        isActive,
      });
      onCategoryEdited();
      onClose();
    } catch (err) {
      console.log(someMessages.UPDATE_CAT_FAIL, err);
      setError(someMessages.UPDATE_CAT_FAIL);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="catm-modal-overlay">
      <div className="catm-modal-content">
        <h2>Edit Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="catm-form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="catm-form-group">
            <label className="catm-checkbox-label">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active Status
            </label>
          </div>
          {error && <div className="catm-error-message">{error}</div>}
          <div className="catm-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="catm-cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="catm-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
