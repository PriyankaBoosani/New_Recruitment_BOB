import React from "react";
import { FiDownload, FiGrid } from "react-icons/fi";
import "./../../../style/css/Dashboard/StateWiseDistribution.css";

const StateWiseDistribution = ({ stateVacancyDistribution = [] }) => {
  const totalVacancies = stateVacancyDistribution.reduce(
    (sum, row) => sum + row.total,
    0
  );

  const totalFilled = stateVacancyDistribution.reduce(
    (sum, row) => sum + row.filled,
    0
  );

  const totalUnfilled = stateVacancyDistribution.reduce(
    (sum, row) => sum + row.unfilled,
    0
  );

  const overallFillRate =
    totalVacancies > 0 ? ((totalFilled / totalVacancies) * 100).toFixed(1) : 0;
  return (
    <div className="state-distribution-card mb-4">
      <div className="state-header">
        <div className="state-title">
          <div className="title-icon">
            <FiGrid />
          </div>

          <div>
            <h3>State Wise Distribution</h3>
            <p>Vacancies distributed by state and city</p>
          </div>
        </div>

        <button className="export-btn">
          <FiDownload />
          Export
        </button>
      </div>

      <div className="table-wrapper">
        <table className="state-table">
          <thead>
            <tr>
              <th>State</th>
              <th>City</th>
              <th>Total Vacancies</th>
              <th>Filled Vacancies</th>
              <th>Unfilled Vacancies</th>
              <th>Fill Rate</th>
            </tr>
          </thead>

          <tbody>
            {stateVacancyDistribution.map((row) => (
              <tr key={row.state}>
                <td className="state-name">{row.state}</td>

                <td className="city-name">{row.city}</td>

                <td className="total">{row.total}</td>

                <td className="filled">{row.filled}</td>

                <td className="unfilled">{row.unfilled}</td>

                <td>
                  <div className="fill-rate">
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${row.rate}%`,
                          background: row.color,
                        }}
                      />
                    </div>

                    <span className="rate-value" style={{ color: "#0f3b96" }}>
                      {row.rate}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total-wrapper">
          <table className="state-total-table">
            <tbody>
              <tr className="total-row">
                <td>Total</td>
                <td className="city-name">All States</td>
                <td className="total">{totalVacancies}</td>
                <td className="filled">{totalFilled}</td>
                <td className="unfilled">{totalUnfilled}</td>
                <td>
                  <div className="fill-rate">
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${overallFillRate}%`,
                          background: "#0f3b96",
                        }}
                      />
                    </div>

                    <span className="rate-value" style={{ color: "#0f3b96" }}>
                      {overallFillRate}%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StateWiseDistribution;
