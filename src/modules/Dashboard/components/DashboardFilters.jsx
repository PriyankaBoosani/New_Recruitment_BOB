import React, { useState } from "react";
import {
  FiFilter,
  FiSearch,
  FiX,
  FiBriefcase,
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";
import { BsBag } from "react-icons/bs";

import "../../../style/css/Dashboard/DashboardFilters.css";

const DashboardFilters = ({ filters, loading }) => {
  const [employmentType, setEmploymentType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedRecruiter, setSelectedRecruiter] = useState("");
  const [initiationType, setInitiationType] = useState("");
  const [periodType, setPeriodType] = useState("FINANCIAL_YEAR");
  const [fyValue, setFyValue] = useState("FY 2026-27");
  const [cyValue, setCyValue] = useState("2026");
  const [quarterYear, setQuarterYear] = useState("2026");
  const [quarterValue, setQuarterValue] = useState("Q1 (Apr-Jun)");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };

  const renderPeriodContent = () => {
    switch (periodType) {
      case "FINANCIAL_YEAR":
        return (
          <div className="period-content">
            <FiCalendar className="period-calendar" />

            <select
              value={fyValue}
              onChange={(e) => setFyValue(e.target.value)}
            >
              <option>FY 2026-27</option>
              <option>FY 2025-26</option>
              <option>FY 2024-25</option>
            </select>
          </div>
        );

      case "CALENDAR_YEAR":
        return (
          <div className="period-content">
            <FiCalendar className="period-calendar" />

            <select
              value={cyValue}
              onChange={(e) => setCyValue(e.target.value)}
            >
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
        );

      case "QUARTERLY":
        return (
          <div className="period-content">
            <FiCalendar className="period-calendar" />

            <div className="quarter-row">
              <select
                value={quarterYear}
                onChange={(e) => setQuarterYear(e.target.value)}
              >
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>

              <select
                value={quarterValue}
                onChange={(e) => setQuarterValue(e.target.value)}
              >
                <option>Q1 (Apr-Jun)</option>
                <option>Q2 (Jul-Sep)</option>
                <option>Q3 (Oct-Dec)</option>
                <option>Q4 (Jan-Mar)</option>
              </select>
            </div>
          </div>
        );

      case "CUSTOM":
        return (
          <div className="period-content">
            <FiCalendar className="period-calendar" />

            <div className="custom-date-row">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <span className="date-arrow">→</span>

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-filters">
      {/* HEADER */}
      <div className="filters-header">
        <div className="header-title">
          <FiFilter />
          <span>DASHBOARD FILTERS</span>
        </div>

        <div className="active-period">
          <span>Active period:</span>
          <span className="period-pill">
            {periodType === "FY"
              ? fyValue
              : periodType === "CY"
                ? cyValue
                : periodType === "Quarter"
                  ? `${quarterYear} - ${quarterValue}`
                  : periodType === "Custom"
                    ? fromDate && toDate
                      ? `${formatDate(fromDate)} → ${formatDate(toDate)}`
                      : "Select Date Range"
                    : ""}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="filters-body">
        {/* TOP ROW */}
        <div className="top-section">
          <div className="filter-group">
            <label>Employment</label>

            <div className="segmented-control">
              {filters?.employmentTypes?.map((item) => (
                <button
                  key={item.value}
                  className={employmentType === item.value ? "active" : ""}
                  onClick={() => setEmploymentType(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="section-divider" />

          <div className="filter-group">
            <label>Initiation</label>

            <div className="segmented-control">
              {filters?.reinitialized?.map((item) => (
                <button
                  key={item.label}
                  className={
                    initiationType === item.value
                      ? `active ${item.value === false ? "danger" : ""}`
                      : ""
                  }
                  onClick={() => setInitiationType(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="horizontal-divider" />

        {/* BOTTOM ROW */}
        <div className="bottom-section">
          {/* PERIOD CARD */}
          <div className="period-card">
            <div className="period-tabs">
              <div className="period-tabs">
                {filters?.dateRangePresets?.map((item) => (
                  <button
                    key={item.value}
                    className={periodType === item.value ? "active" : ""}
                    onClick={() => setPeriodType(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {renderPeriodContent()}
          </div>

          <div className="vertical-divider" />

          {/* FILTERS */}
          <div className="filters-middle">
            <div className="filter-pill">
              <div className="pill-icon">
                <BsBag />
              </div>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>

                {filters?.departments?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <FiChevronDown className="dropdown-arrow" />
            </div>

            <div className="filter-pill">
              <div className="pill-icon">
                <FiBriefcase />
              </div>

              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                <option value="">All Positions</option>

                {filters?.positions?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <FiChevronDown className="dropdown-arrow" />
            </div>

            <div className="filter-pill">
              <div className="pill-icon">
                <FiMapPin />
              </div>

              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
              >
                <option value="">All Zones</option>

                {filters?.zones?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <FiChevronDown className="dropdown-arrow" />
            </div>

            <div className="filter-pill">
              <div className="pill-icon">
                <FiUsers />
              </div>

              <select
                value={selectedRecruiter}
                onChange={(e) => setSelectedRecruiter(e.target.value)}
              >
                <option value="">All Recruiters</option>

                {filters?.recruiters?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <FiChevronDown className="dropdown-arrow" />
            </div>
          </div>

          <div className="vertical-divider" />

          {/* ACTIONS */}
          <div className="actions-section">
            <button className="reset-btn">
              <FiX />
              Reset
            </button>

            <button className="apply-btn">
              <FiSearch />
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
