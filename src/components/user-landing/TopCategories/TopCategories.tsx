import {
  FaMoneyBillAlt,
  FaUserAlt,
  FaUserFriends,
  FaUserTie,
} from "react-icons/fa";
import { imageLinks } from "../../../utils/constants";
import "./TopCategories.scss";

const TopCategories = () => {
  return (
    <div className="top-categories-container">
      <div className="left-section">
        <img
          src={imageLinks.STUDENTS_LIBARARY}
          alt="Library Illustration"
          className="illustration"
        />
      </div>

      <div className="right-section">
        <h2>Top Categories</h2>
        <div className="categories-grid">
          <div className="category-item">
            <FaMoneyBillAlt size={48} className="category-icon" />
            <span className="category-name">Art & Design</span>
            <span className="category-count">5 Courses</span>
          </div>
          <div className="category-item">
            <FaUserAlt size={48} className="category-icon" />
            <span className="category-name">Art & Design</span>
            <span className="category-count">5 Courses</span>
          </div>
          <div className="category-item">
            <FaUserFriends size={48} className="category-icon" />
            <span className="category-name">Coding</span>
            <span className="category-count">10 Courses</span>
          </div>
          <div className="category-item">
            <FaUserTie size={48} className="category-icon" />
            <span className="category-name">Art & Design</span>
            <span className="category-count">3 Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
