import React, { useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import searchIcon from "../../../assets/search-icon.png";

export default function BulkCommunicationPool({
  candidates,
  loading,
  page,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  filters,
  setFilters,
  selectedIds,
  setSelectedIds,
  allCandidatesForFilters,
  hasLocationData,
  onTriggerCommunication,
}) {
  const { t } = useTranslation(["candidateWorkflow", "common"]);

  const CANDIDATE_POOL_STATUSES = [
    "PENDING", "APPLIED", "RESCHEDULED", "NOT_SCHEDULED", "SCHEDULED", 
    "SELECTED_FOR_NEXT_ROUND", "NOT_AVAILABLE", "SELECTED", "REJECTED", 
    "DISQUALIFIED", "CANCELLED", "SHORTLISTED", "ELIGIBLE", "OFFERED", 
    "OFFER_REJECTED", "OFFER_ACCEPTED", "DISCREPANCY", "PROVISIONALLY_APPROVED", 
    "OFFER_AWAITED", "OFFER_SENT", "ZONAL_REJECTED", "ZONAL_ABSENT", 
    "INTERVIEW_ABSENT", "COMPENSATION_PENDING", "COMPENSATION_APPROVED", 
    "COMPENSATION_REJECTED", "COMPENSATION_RENEGOTITATE", "SCHEDULE_PENDING", 
    "RESCHEDULE_PENDING", "PRE_ONBOARDING_PENDING", "PRE_ONBOARDING_COMPLETED", 
    "ONBOARDED"
  ];

  const STATUS_CLASS_MAP = {
    Applied: "bg-secondary",
    Shortlisted: "bg-warning",
    Discrepancy: "bg-primary",
    Rejected: "bg-danger",
    Pending: "bg-info",
    Selected: "bg-success",
    Offered: "bg-success",
    Onboarded: "bg-success",
  };

  const STATUS_LABEL_MAP = {
    SHORTLISTED: t("candidateWorkflow:shortlisted", "Shortlisted"),
    APPLIED: t("candidateWorkflow:applied", "Applied"),
    REJECTED: t("candidateWorkflow:rejected", "Rejected"),
    DISCREPANCY: t("candidateWorkflow:discrepancy", "Discrepancy"),
    PENDING: t("candidateWorkflow:pending", "Pending"),
    ELIGIBLE: t("candidateWorkflow:eligible", "Eligible"),
    SCHEDULED: t("candidateWorkflow:interview_scheduled", "Scheduled"),
  };

  const formatStatusFallback = (statusString) => {
    if (!statusString) return "";
    return statusString
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    if (!filters?.status?.length) {
      setSelectedIds([]);
    }
  }, [filters?.status, setSelectedIds]);

  const availableLocations = useMemo(() => {
    const map = new Map();
    allCandidatesForFilters.forEach((c) => {
      if (c.stateId && c.location) map.set(c.stateId, c.location);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [allCandidatesForFilters]);

  const availableCategories = useMemo(() => {
    const map = new Map();
    allCandidatesForFilters.forEach((c) => {
      if (c.categoryId && c.categoryName) map.set(c.categoryId, c.categoryName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [allCandidatesForFilters]);

  const allSelected = allCandidatesForFilters?.length > 0 && allCandidatesForFilters.every((c) => selectedIds.includes(c.id));

  const toggleSelectAll = () => {
    if (!filters?.status?.length) {
      toast.error("Please select the status filter first before bulk selection matching.");
      return;
    }
    const allIds = allCandidatesForFilters.map((c) => c.id);
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
      toast.success(`${allIds.length} candidate(s) added to the communication scope context.`);
    }
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Dynamically calculate colSpan for placeholder rows to match structural width changes
  const dynamicColSpan = hasLocationData ? 7 : 6;

  return (
    <div className="card rounded border-0 mt-4 mb-5">
      
      {/* 2-Row Toolbar Section */}
      <div className="p-3" style={{ backgroundColor: "#F9FAFB" }}>
        
        {/* Row 1: Filter Labels & Action Pickers */}
        <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
          <span className="fs-14 text-secondary">Filter by:</span>
          <button
            className="btn fs-14 text-danger border-0 bg-transparent p-0 fw-medium"
            onClick={() => setFilters({ status: [], stateId: "", categoryId: "", searchText: "" })}
          >
            {t("common:clear_all", "Clear all")}
          </button>
          
          <div className="d-flex align-items-center gap-2 ms-2">
            <select
              className="form-select fs-14 py-2"
              style={{ width: "200px", borderRadius: "6px" }}
              value={filters?.status[0] || ""}
              onChange={(e) => {
                onPageChange(0);
                setFilters((prev) => ({ ...prev, status: e.target.value ? [e.target.value] : [] }));
              }}
            >
              <option value="">{t("candidateWorkflow:all_statuses", "All Statuses")}</option>
              {CANDIDATE_POOL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABEL_MAP[status] || formatStatusFallback(status)}
                </option>
              ))}
            </select>

            {hasLocationData && (
              <select
                className="form-select fs-14 py-2"
                style={{ width: "160px", borderRadius: "6px" }}
                value={filters?.stateId}
                onChange={(e) => { onPageChange(0); setFilters(prev => ({ ...prev, stateId: e.target.value })); }}
              >
                <option value="">{t("candidateWorkflow:all_locations", "All Locations")}</option>
                {availableLocations?.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            )}

            <select
              className="form-select fs-14 py-2"
              style={{ width: "180px", borderRadius: "6px" }}
              value={filters.categoryId}
              onChange={(e) => { onPageChange(0); setFilters(prev => ({ ...prev, categoryId: e.target.value })); }}
            >
              <option value="">{t("candidateWorkflow:all_categories", "All Categories")}</option>
              {availableCategories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Search Box & Pill Counter (Left side group) | Trigger Button (Far Right side) */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: "650px" }}>
            <div className="input-group" style={{ maxWidth: "440px" }}>
              <span className="input-group-text bg-white border-end-0 py-2">
                <img alt="search" src={searchIcon} width={15} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 fs-14 py-2"
                placeholder={t("candidateWorkflow:search_candidates", "Search candidates...")}
                value={filters.searchText}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchText: e.target.value }))}
                style={{ borderRadius: "0 6px 6px 0" }}
              />
            </div>

            {/* Static layout pill badge precisely matching your design asset */}
            <span 
              className="py-1 px-3 fs-13 text-center"
              style={{
                backgroundColor: "#EDF2FF",
                color: "#1A365D",
                borderRadius: "30px",
                whiteSpace: "nowrap",
                display: "inline-block",
                fontWeight: "400"
              }}
            >
              {selectedIds.length} Candidates Selected
            </span>
          </div>

          {/* Action Trigger Button floated smoothly to the right margin */}
          <button 
            className="btn btn-primary py-2 px-4 fs-14"
            disabled={selectedIds.length === 0}
            onClick={onTriggerCommunication}
            style={{ borderRadius: "6px", minWidth: "180px" }}
          >
            Trigger Communication
          </button>
        </div>

      </div>

      {/* Structured Evaluation Datagrid */}
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="bg-light">
            <tr>
              <th className="fs-14 fw-normal py-3" style={{ paddingLeft: "1rem", width: "40px" }}>
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
              </th>
              <th className="fs-14 fw-normal py-3">{t("candidateWorkflow:candidate")}</th>
              <th className="fs-14 fw-normal py-3">Email Address</th>
              <th className="fs-14 fw-normal py-3">{t("candidateWorkflow:experience")}</th>
              <th className="fs-14 fw-normal py-3">{t("candidateWorkflow:status")}</th>
              {hasLocationData && <th className="fs-14 fw-normal py-3">{t("common:location")}</th>}
              <th className="fs-14 fw-normal py-3">{t("common:category")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={dynamicColSpan} className="text-center py-4">
                  {t("candidateWorkflow:loading_candidates")}
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan={dynamicColSpan} className="text-center py-4">
                  {t("candidateWorkflow:no_candidates_found")}
                </td>
              </tr>
            ) : (
              candidates.map((c) => (
                <tr key={c.id}>
                  <td className="align-content-center" style={{ paddingLeft: "1rem" }}>
                    <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleRow(c.id)} />
                  </td>
                  <td className="align-content-center">
                    <p className="fw-normal fs-14 mb-0">{c.name}</p>
                    <small className="text-muted fs-12 d-block">{t("candidateWorkflow:application_number")}: {c.applicationNo}</small>
                    <small className="text-primary fs-12 d-block mt-0.5 fw-medium">{c.positionName}</small>
                  </td>
                  <td className="align-content-center fs-14 text-secondary">
                    {c.email}
                  </td>
                  <td className="align-content-center">{((c.experienceMonths ?? 0) / 12).toFixed(1)} {t("candidateWorkflow:years")}</td>
                  <td className="align-content-center">
                    <span className={`round_badge px-3 py-1 fs-12 rounded text-white ${STATUS_CLASS_MAP[c.status] || "bg-secondary"}`}>
                      {c.status}
                    </span>
                  </td>
                  {hasLocationData && <td className="align-content-center">{c.location}</td>}
                  <td className="align-content-center">{c.categoryName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Toolbar Footer Container */}
      <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
        <div className="fs-14 text-muted">
          {t("candidateWorkflow:showing")} {page * pageSize + 1}–{Math.min((page + 1) * pageSize, totalElements)} {t("candidateWorkflow:of")} {totalElements}
        </div>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select fs-14"
            style={{ width: "90px" }}
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(0);
            }}
          >
            {[10, 20, 50].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => onPageChange(page - 1)}>{t("candidateWorkflow:prev")}</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={(page + 1) * pageSize >= totalElements} onClick={() => onPageChange(page + 1)}>{t("candidateWorkflow:next")}</button>
        </div>
      </div>
    </div>
  );
}