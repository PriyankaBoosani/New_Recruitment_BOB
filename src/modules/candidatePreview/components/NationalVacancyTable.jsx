// src/modules/candidatePreview/components/NationalVacancyTable.jsx
import React from "react";

const NationalVacancyTable = ({ nationalCategoryDistribution }) => {
  if (!nationalCategoryDistribution) return null;

  const { categories, disabilities, totalVacancies } =
    nationalCategoryDistribution;

  return (
   <div className="category-reservation-card mt-3">
  <div className="category-title fs-14" style={{ fontWeight: 600 }}>
    Category Wise Reservation
  </div>

  <div className="table-responsive">
    <table className="category-table">
      <thead>
        <tr>
          <th colSpan="6" className="group-header text-center">
            General Category
          </th>
          <th colSpan="4" className="group-header text-center">
            Disability Category
          </th>
        </tr>
        <tr>
          <th className="text-center">GEN</th>
          <th className="text-center">EWS</th>
          <th className="text-center">SC</th>
          <th className="text-center">ST</th>
          <th className="text-center">OBC</th>
          <th className="text-center">Total</th>
          <th className="text-center">HI</th>
          <th className="text-center">VI</th>
          <th className="text-center">OC</th>
          <th className="text-center">ID</th>
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
