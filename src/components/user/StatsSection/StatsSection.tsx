import React from "react";
import "./StatsSection.scss";

const StatsSection = () => {
  return (
    <div className="stats-section">
      <div className="stats-grid">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="stat-box">
              <h1 className="stat-value">88</h1>
              <p className="stat-text">Hello</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StatsSection;
