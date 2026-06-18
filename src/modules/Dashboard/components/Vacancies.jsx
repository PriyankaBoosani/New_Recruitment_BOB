import React from "react";
import { FaLayerGroup, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../../style/css/Dashboard/Vacancies.css";

const Vacancies = ({ summary }) => {
  const totalVacancies = summary?.totalVacancies ?? 0;
  const filledVacancies = summary?.filledVacancies ?? 0;
  const unfilledVacancies = summary?.unfilledVacancies ?? 0;

  const fillRate =
    totalVacancies > 0
      ? ((filledVacancies / totalVacancies) * 100).toFixed(1)
      : 0;
  return (
    <div className="vacancy-widget">
      <div className="vacancy-header">
        <div className="vacancy-title">Vacancies</div>
        <div className="vacancy-subtitle">Vacancy fill-rate overview</div>
      </div>

      <div className="vacancy-cards">
        <div className="vacancy-stat-card vacancy-total">
          <div className="icon-box">
            <FaLayerGroup />
          </div>

          <div className="stat-value"> {(summary?.totalVacancies ?? 0).toLocaleString('en-IN')}</div>
          <div className="stat-label">Total Vacancies</div>
        </div>

        <div className="vacancy-stat-card vacancy-filled">
          <div className="icon-box">
            <FaCheckCircle />
          </div>

          <div className="stat-value"> {(summary?.filledVacancies ?? 0).toLocaleString('en-IN')}</div>
          <div className="stat-label">Filled Vacancies</div>
        </div>

        <div className="vacancy-stat-card vacancy-unfilled">
          <div className="icon-box">
            <FaTimesCircle />
          </div>

          <div className="stat-value">{(summary?.unfilledVacancies ?? 0).toLocaleString('en-IN')}</div>
          <div className="stat-label">Unfilled Vacancies</div>
        </div>
      </div>

      <div className="fill-rate-section">
        <div className="fill-rate-header">
          <span>Fill Rate</span>
          <span>{fillRate}%</span>
        </div>

        <div className="fill-progress">
          <div className="fill-progress-bar" style={{ width: "58.4%" }} />
        </div>

        <div className="fill-rate-footer">
          <span>{filledVacancies} filled</span>
          <span>{unfilledVacancies} remaining</span>
        </div>
      </div>
    </div>
  );
};

export default Vacancies;
