import React, { useEffect, useState } from "react";
import {
  FiFilter,
  FiSearch,
  FiX,
  FiBriefcase,
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiChevronDown,
  FiGitBranch,
} from "react-icons/fi";
import { BsBag } from "react-icons/bs";

import "../../../style/css/Dashboard/DashboardFilters.css";

const DashboardFilters = ({ filters, loading, onApply }) => {
  const [employmentType, setEmploymentType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedRecruiter, setSelectedRecruiter] = useState("");
  const [initiationType, setInitiationType] = useState("");
  const [periodType, setPeriodType] = useState("FINANCIAL_YEAR");
  const [fyValue, setFyValue] = useState("");
  const [cyValue, setCyValue] = useState("");
  const [quarterYear, setQuarterYear] = useState("");
  const [quarterValue, setQuarterValue] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };
  const handleApply = () => {
    const payload = {
      dateRangePreset: periodType,

      fyYear:
        periodType === "FINANCIAL_YEAR"
          ? parseInt(fyValue.match(/\d{4}/)?.[0] || 0, 10)
          : null,

      cyYear:
        periodType === "CALENDAR_YEAR"
          ? parseInt(cyValue, 10)
          : periodType === "QUARTER"
            ? parseInt(quarterYear, 10)
            : null,

      quarter:
        periodType === "QUARTER"
          ? parseInt(quarterValue.match(/Q(\d)/)?.[1] || 1, 10)
          : null,

      fromDate: fromDate || null,
      toDate: toDate || null,

      departmentId: selectedDepartment || null,
      positionId: selectedPosition || null,
      zone: selectedZone || null,
      stateId: null,
      cityId: null,
      recruiterId: selectedRecruiter || null,
      employmentTypeId: employmentType || null,
      isReinitialized: initiationType === "" ? null : initiationType,
    };
    onApply(payload);
  };
  const handleReset = () => {
    setSelectedDepartment("");
    setSelectedPosition("");
    setSelectedZone("");
    setSelectedRecruiter("");

    setFromDate("");
    setToDate("");

    setPeriodType("FINANCIAL_YEAR");
    setFyValue("");
    setCyValue("");
    setQuarterYear("");
    setQuarterValue("");

    // Reset to default Employment (Regular)
    setEmploymentType(filters?.employmentTypes?.[0]?.value || "");

    // Reset to default Initiation
    setInitiationType(filters?.reinitialized?.[0]?.value ?? "");
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
              <option>Select FY</option>
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
              <option>Select CY</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>
        );

      case "QUARTER":
        return (
          <div className="period-content">
            <FiCalendar className="period-calendar" />

            <div className="quarter-row">
              <select
                value={quarterYear}
                onChange={(e) => setQuarterYear(e.target.value)}
              >
                <option>Select CY</option>
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>

              <select
                value={quarterValue}
                onChange={(e) => setQuarterValue(e.target.value)}
              >
                <option>Select Quater</option>
                <option value="Q1">Q1 (Jan-Mar)</option>
                <option value="Q2">Q2 (Apr-Jun)</option>
                <option value="Q3">Q3 (Jul-Sep)</option>
                <option value="Q4">Q4 (Oct-Dec)</option>
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
  const filteredPositions = selectedDepartment
    ? filters?.positions?.filter(
        (position) =>
          String(position.departmentId) === String(selectedDepartment)
      )
    : filters?.positions || [];

  useEffect(() => {
    if (!employmentType && filters?.employmentTypes?.length) {
      setEmploymentType(filters.employmentTypes[0].value);
    }
  }, [filters, employmentType]);

  useEffect(() => {
    if (initiationType === "" && filters?.reinitialized?.length) {
      setInitiationType(filters.reinitialized[0].value);
    }
  }, [filters, initiationType]);
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
            {periodType === "FINANCIAL_YEAR"
              ? fyValue || "Select FY"
              : periodType === "CALENDAR_YEAR"
                ? cyValue || "Select CY"
                : periodType === "QUARTER"
                  ? quarterYear && quarterValue
                    ? `${quarterYear} - ${quarterValue}`
                    : "Select Quarter"
                  : periodType === "CUSTOM"
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
            <label>
              <FiBriefcase /> Employment
            </label>

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
            <label>
              {" "}
              <FiGitBranch className="text-danger" /> Initiation
            </label>

            <div className="segmented-control">
              {filters?.reinitialized?.map((item) => (
                <button
                  key={item.label}
                  className={
                    initiationType === item.value
                      ? `active ${item.value === false ? "active" : ""}`
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
              {filters?.dateRangePresets?.map((item) => (
                <button
                  key={item.value}
                  className={periodType === item.value ? "active" : ""}
                  onClick={() => {
                    setPeriodType(item.value);

                    setFyValue("");
                    setCyValue("");
                    setQuarterYear("");
                    setQuarterValue("");
                    setFromDate("");
                    setToDate("");
                  }}
                >
                  {item.label}
                </button>
              ))}
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
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedPosition("");
                }}
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
                onChange={(e) => {
                  setSelectedPosition(e.target.value);
                }}
              >
                <option value="">All Positions</option>

                {filteredPositions.map((item) => (
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
            <button className="reset-btn" onClick={handleReset}>
              <FiX />
              Reset
            </button>

            <button className="apply-btn" onClick={handleApply}>
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
