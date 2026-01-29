// src/modules/candidatePreview/components/NationalVacancyTable.jsx
import React from "react";

const NationalVacancyTable = ({ nationalCategoryDistribution }) => {
  if (!nationalCategoryDistribution) return null;

  const { categories, disabilities, totalVacancies } =
    nationalCategoryDistribution;

  return (
   <div className="category-reservation-card mt-3">
  <div className="category-title">
    Category Wise Reservation
  </div>

  <div className="table-responsive">
    <table className="category-table">
      <thead>
        <tr>
          <th colSpan="6" className="group-header">
            General Category
          </th>
          <th colSpan="4" className="group-header">
            Disability Category
          </th>
        </tr>
        <tr>
          <th>GEN</th>
          <th>EWS</th>
          <th>SC</th>
          <th>ST</th>
          <th>OBC</th>
          <th>Total</th>
          <th>HI</th>
          <th>VI</th>
          <th>OC</th>
          <th>ID</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{categories.GEN}</td>
          <td>{categories.EWS}</td>
          <td>{categories.SC}</td>
          <td>{categories.ST}</td>
          <td>{categories.OBC}</td>
          <td>{totalVacancies}</td>
          <td>{disabilities.HI}</td>
          <td>{disabilities.VI}</td>
          <td>{disabilities.OC}</td>
          <td>{disabilities.ID}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

  );
};

export default NationalVacancyTable;
