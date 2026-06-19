import React from "react";
import { FiUsers } from "react-icons/fi";
import "../../../style/css/Dashboard/CategoryWiseDistribution.css";

const colorClasses = ["blue", "red", "green", "orange", "purple"];

const CategoryWiseDistribution = ({ categories = [] }) => {
  return (
    <div className="category-distribution-card mb-4">
      <div className="category-header">
        <div className="category-header-icon">
          <FiUsers />
        </div>

        <div>
          <h2>Category Wise Distribution</h2>
          <p>Vacancy distribution by category</p>
        </div>
      </div>

      <div className="category-grid">
        {categories.length === 0 ? (
          <div className="no-data">No Data Available</div>
        ) : (
          categories.map((item, index) => (
            <div
              key={item.code}
              className={`category-stat-card ${
                colorClasses[index % colorClasses.length]
              }`}
            >
              <div className="category-card-top">
                <span className="category-name">{item.code}</span>
                <span className="category-dot"></span>
              </div>

              <div className="category-card-content">
                <div className="category-count">{item.count}</div>

                <div className="category-icon">
                  <FiUsers />
                </div>
              </div>

              <div className="category-details-hover">Vacancies</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryWiseDistribution;
