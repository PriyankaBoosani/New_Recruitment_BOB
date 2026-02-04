import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Person, FileText } from "react-bootstrap-icons";

export default function CandidatePool({
  candidates,
  selectedIds,
  setSelectedIds,
  onView,
  onViewFile,
  loading,
  page,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  selectedPositionId,
  requisition,
  position,
  selectedRequisitionId
}) {
	const STATUS_CLASS_MAP = {  
		Applied: "bg-secondary",
		Shortlisted: "bg-warning",
		Discrepency: "bg-primary",
		Rejected: "bg-danger",
    Scheduled: "bg-secondary"
	};
	const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
	console.log(candidates)

  /* ---------- Selection logic ---------- */

  const allSelected =
    candidates.length > 0 && selectedIds.length === candidates.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map((c) => c.id));
    }
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ---------- Sorting logic ---------- */

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

  /* ---------- Render ---------- */

  return (
    <>
      {/* Desktop Table */}
      <div className="card-body p-0 d-none d-md-block">
        <table className="table table-hover mb-0">
          <thead className="bg-light">
            <tr>
              <th className="fs-14 fw-normal py-3" style={{ paddingLeft: '1rem' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="fs-14 fw-normal py-3" onClick={() => requestSort("name")} role="button">
                Candidate {sortIcon("name")}
              </th>

							{/* <th className="fs-14 fw-normal py-3" onClick={() => requestSort("rank")} role="button">
                Rank {sortIcon("rank")}
              </th>

							<th className="fs-14 fw-normal py-3" onClick={() => requestSort("score")} role="button">
                Score {sortIcon("score")}
              </th> */}

              <th className="fs-14 fw-normal py-3" onClick={() => requestSort("experienceMonths")} role="button">
                Experience {sortIcon("experienceMonths")}
              </th>

              <th className="fs-14 fw-normal py-3">
                Status
              </th>

              <th className="fs-14 fw-normal py-3">
                Location
              </th>

              <th className="fs-14 fw-normal py-3">
                Category
              </th>

              <th className="text-center fs-14 fw-normal py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  Loading candidates...
                </td>
              </tr>
            ) : sortedCandidates.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No candidates found
                </td>
              </tr>
            ) : (
              sortedCandidates.map((c) => (
              <tr key={c.id}>
                <td className="align-content-center" style={{ paddingLeft: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggleRow(c.id)}
                  />
                </td>

                <td className="align-content-center">
                  <p className="fw-normal fs-14 mb-0">{c.name}</p>
                  <p className="text-muted fs-12 mb-0">
                    Reg No: {c.applicationNo}
                  </p>
                </td>

								{/* <td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{c?.rank || "-"}</p>
								</td>

								<td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{c?.score || "-"}</p>
								</td> */}

                <td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{(c.experienceMonths / 12).toFixed(1)} years</p>
								</td>

                <td className="align-content-center">
                  <span
										className={`round_badge px-3 py-1 fs-12 rounded text-white ${
											STATUS_CLASS_MAP[c.status] || "bg-secondary"
										}`}
									>
										{c.status}
									</span>
                </td>

                <td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{c.location}</p>
								</td>

                <td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{c.categoryName}</p>
								</td>

               <td className="text-center align-content-center">
  <Person
    className="me-3 cursor-pointer"
    onClick={() =>
      navigate("/candidate-preview", {
        state: {
          candidate: c,
          positionId: selectedPositionId,
          requisitionId: selectedRequisitionId,
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

        {/* Pagination */}
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

      {/* Mobile Cards (NO checkboxes here on purpose) */}
      <div className="d-md-none">
        {candidates.map((c) => (
          <div key={c.id} className="card mb-3">
            <div className="card-body">
              <h6 className="fw-bold mb-1">{c.name}</h6>
              <small className="text-muted d-block mb-2">
                Reg No: {c.regNo}
              </small>

              <div className="mb-1">
                <strong>Experience:</strong> {(c.experienceMonths / 12).toFixed(1)} years
              </div>
              <div className="mb-1">
                <strong>Status:</strong>{" "}
                <span
									className={`round_badge px-3 py-1 fs-12 rounded text-white ${
										STATUS_CLASS_MAP[c.status] || "bg-secondary"
									}`}
								>
									{c.status}
								</span>
              </div>
              <div className="mb-1">
                <strong>Location:</strong> {c.location}
              </div>
              <div className="mb-2">
                <strong>Category:</strong> {c.categoryName}
              </div>

              <div className="d-flex gap-2">
                <Person
									className="me-3 cursor-pointer"
									onClick={() =>
										navigate("/candidate-preview", {
											state: { candidate: c, positionId: selectedPositionId, requisitionId: selectedRequisitionId,
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
