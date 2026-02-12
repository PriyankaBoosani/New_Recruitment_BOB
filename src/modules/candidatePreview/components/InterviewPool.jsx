import React, { useState, useMemo } from "react";
import { Person, FileText } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import I_icon from '../../../assets/I_icon.png';

export default function InterviewPool({
  selectedIds,
  setSelectedIds,
  candidates,
  selectedRequisitionId,
  selectedPositionId,
  requisition,
  position,
  onViewFile,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  totalElements,
  onOpenFeedback
}) {
  const navigate = useNavigate();
  const STATUS_CLASS_MAP = {
    SCHEDULED: "blue-bg",
    QUALIFIED: "bg-success",
    DISQUALIFIED: "bg-primary",
  };
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const formatStatus = (status = "") => status.toLowerCase().split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");



  const allSelected =
    candidates.length > 0 && selectedIds.length === candidates.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : candidates.map((c) => c.id));
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const requestSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedCandidates = useMemo(() => {
    if (!sortConfig.key) return candidates;

    return [...candidates].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc"
          ? aVal - bVal
          : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [candidates, sortConfig]);

  const sortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <div className="card-body p-0">
      <table className="table table-hover mb-0">
        <thead className="bg-light">
          <tr>
            <th style={{ paddingLeft: "1rem" }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="fs-14 fw-normal py-3" >Candidate</th>
            <th className="fs-14 fw-normal py-3">Date</th>
            <th className="fs-14 fw-normal py-3">Time</th>
            <th className="fs-14 fw-normal py-3">Zone</th>
            <th className="fs-14 fw-normal py-3"> Panel Details</th>
            <th className="fs-14 fw-normal py-3">Interview Status</th>
            <th className="fs-14 fw-normal py-3">Score</th>
            <th className="text-center fs-14 fw-normal py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {candidates.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4 text-muted fs-14">
                No candidates in Interview Pool yet.
              </td>
            </tr>
          ) : (
            sortedCandidates.map((c) => (

              <tr key={c.id}>
                <td style={{ paddingLeft: "1rem" }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggleRow(c.id)}
                  />
                </td>

                <td className="align-content-center">
                  <p className="fw-normal fs-14 mb-0">{c.name}</p>
                  <p className="text-muted fs-12 mb-0">Reg No: {c.regNo}</p>
                </td>

                <td className="fs-14 align-content-center">{c.date}</td>
                <td className="fs-14 align-content-center">{c.time}</td>
                <td className="fs-14 align-content-center">{c.zone}</td>
                <td className="fs-14 align-content-center">{c.panel}</td>

                <td className="align-content-center">
                  <span
                    className={`round_badge px-3 py-1 fs-12 rounded text-white ${STATUS_CLASS_MAP[c.status] || "bg-secondary"
                      }`}
                  >
                    {formatStatus(c.status)}
                  </span>
                </td>

                <td className="fs-14 align-content-center">
                  <div className="d-flex align-items-center gap-2">
                    <span className="scorebg">
                      {c.score || "-"}
                    </span>

                    <span
                      className="cursor-pointer text-danger fw-bold"
                      onClick={() => onOpenFeedback(c.id)}
                    >
                      < img src={I_icon} alt="feedback" className="infoicon-16" />
                    </span>
                  </div>
                </td>



                <td className="text-center align-content-center">
                  <Person
                    className="me-3 cursor-pointer"
                    onClick={() =>
                      console.log("Navigating to preview", c) ||
                      navigate("/candidate-preview", {
                        state: {
                          candidate: c,
                          applicationId: c.applicationId,
                          positionId: selectedPositionId,
                          requisitionId: selectedRequisitionId,
                          fromInterviewPool: true,
                          requisition: requisition
                            ? {
                              requisition_code: requisition.requisition_code,
                              requisition_title: requisition.requisition_title,
                              registration_start_date: requisition.registration_start_date,
                              registration_end_date: requisition.registration_end_date,
                            }
                            : null,
                          position: position
                            ? {
                              positionId: position.positionId,
                              positionName: position.positionName,
                            }
                            : null,
                        },
                      })
                    }
                  />
                  <FileText className="cursor-pointer" onClick={() => onViewFile(c)} />
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

      <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
        <div className="fs-14 text-muted">
          Showing {page * pageSize + 1}–
          {Math.min((page + 1) * pageSize, totalElements)} of {totalElements}
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

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={(page + 1) * pageSize >= totalElements}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
