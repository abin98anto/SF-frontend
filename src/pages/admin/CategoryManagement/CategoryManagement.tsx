import { useEffect, useState } from "react";
import { PlusCircle, Edit } from "lucide-react";

import "./CategoryManagement.scss";
import AddCategoryModal from "./Modals/AddCategoryModal";
import axiosInstance from "../../../utils/axiosConfig";
import EditCategoryModal from "./Modals/EditCategoryModal";
import { ICategory } from "../../../entities/categories/ICategories";
import { API_ENDPOINTS, someMessages } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { AppRootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

interface ICategoryResponse {
  data: ICategory[];
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  const { isAuthenticated } = useSelector(
    (state: AppRootState) => state.adminLogin
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated]);

  const handleEditClick = (category: ICategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCategoryEdited = () => {
    fetchCategories();
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<ICategoryResponse>(
        API_ENDPOINTS.GET_CATS
      );
      const categoriesData = response.data.data;

      setCategories(categoriesData);
    } catch (err) {
      console.error(someMessages.FETCH_CAT_FAIL, err);
      setError(someMessages.FETCH_CAT_FAIL);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryAdded = () => {
    fetchCategories();
  };

  return (
    <>
      <div className="category-management">
        <div className="header">
          <h1>Category Management</h1>
          <button onClick={() => setIsModalOpen(true)} className="add-button">
            <PlusCircle className="icon" />
            Add Category
          </button>
        </div>

        {isLoading && <p className="status-message">Loading...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!isLoading &&
        !error &&
        Array.isArray(categories) &&
        categories.length === 0 ? (
          <p className="status-message">
            No categories found. Add a new category to get started.
          </p>
        ) : (
          !isLoading &&
          !error &&
          Array.isArray(categories) && (
            <div className="table-container">
              <table className="category-table">
                <thead>
                  <tr>
                    <th>Sl No.</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category._id}>
                      <td>{index + 1}</td>
                      <td>{category.name}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            category.isActive ? "active" : "inactive"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-button edit"
                          onClick={() => handleEditClick(category)}
                        >
                          <Edit className="icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCategoryAdded={handleCategoryAdded}
        />
      </div>

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onCategoryEdited={handleCategoryEdited}
        category={selectedCategory}
      />
    </>
  );
};

export default CategoryManagement;
