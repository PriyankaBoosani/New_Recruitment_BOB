import React from "react";
import { FaEye, FaPen } from "react-icons/fa";
export default function ExaminationCutoffTable({
  rows = [],
  onView,
  onEdit,
  page,
  setPage,

  pageSize,
  setPageSize,

  totalPages,
  totalElements,
  statusFilter,
  setStatusFilter,
}) {
  /* ================= DUMMY DATA ================= */

  const tableRows = rows || [];

  return (
    <div className="cutoff-table-wrapper bg-white rounded-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="table-main-heading m-0">
          Position Wise Cutoff Configuration
        </h5>

        <div className="d-flex align-items-center gap-2">
          {/* STATUS FILTER */}

          <button
            className="btn btn-light border"
            style={{
              height: "38px",
              minWidth: "100px",
            }}
            onClick={() => {
              setStatusFilter([]);
            }}
          >
            Clear All
          </button>

          <select
            className="form-select"
            style={{
              width: "180px",
              height: "38px",
            }}
            value={statusFilter[0] || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (!value) {
                setStatusFilter([]);

                return;
              }

              setStatusFilter([value]);
            }}
          >
            <option value="">All Status</option>

            <option value="PENDING">Pending</option>

            <option value="L1_PENDING">L1 Pending</option>

            <option value="L1_REJECTED">L1 Rejected</option>

            <option value="L2_PENDING">L2 Pending</option>

            <option value="L2_REJECTED">L2 Rejected</option>

            <option value="APPROVED">Approved</option>
          </select>

          {/* CLEAR ALL */}
        </div>
      </div>

      {/* TABLE */}

      <div className="table-responsive">
        <table className="table align-middle cutoff-custom-table">
          <thead>
            <tr>
              <th>Position</th>

              <th>Total Marks</th>

              <th>No. of Sections</th>

              <th className="weightage-column">Weightage</th>

              <th>Status</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tableRows.length > 0 ? (
              tableRows.map((item, index) => (
                <tr key={index}>
                  <td>{item.positionName || item.positionId}</td>

                  <td>{item.totalMarks}</td>

                  <td>{item.sections?.length || 0}</td>

                  <td>
                    <span className="fw-semibold">
                      {item.writtenExamWeightage}%
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-pill ${
                        item.status === "APPROVED" ||
                        item.status === "L1_APPROVED"
                          ? "approved"
                          : item.status === "REJECTED" ||
                              item.status === "L1_REJECTED" ||
                              item.status === "L2_REJECTED"
                            ? "rejected"
                            : item.status === "FINALIZED"
                              ? "finalized"
                              : "pending"
                      }`}
                    >
                      {item.status?.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2 w-100">
                      <button
                        className="icon-btn"
                        onClick={() => onView && onView(item)}
                      >
                        <FaEye size={13} />
                      </button>

                      <button
                        className="icon-btn"
                        disabled={
                          !["PENDING", "L1_REJECTED", "L2_REJECTED"].includes(
                            item.status
                          )
                        }
                        style={{
                          opacity: ![
                            "PENDING",
                            "L1_REJECTED",
                            "L2_REJECTED",
                          ].includes(item.status)
                            ? 0.5
                            : 1,
                          cursor: ![
                            "PENDING",
                            "L1_REJECTED",
                            "L2_REJECTED",
                          ].includes(item.status)
                            ? "not-allowed"
                            : "pointer",
                        }}
                        onClick={() => {
                          if (
                            !["PENDING", "L1_REJECTED", "L2_REJECTED"].includes(
                              item.status
                            )
                          ) {
                            return;
                          }

                          onEdit && onEdit(item);
                        }}
                      >
                        <FaPen size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No configurations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      {/* ================= FOOTER ================= */}

      <div className="d-flex justify-content-between align-items-center px-3 py-2 table-footer">
        {/* Showing text */}

        <span className="text-muted fs-13">
          {totalElements > 0
            ? `Showing ${page * pageSize + 1}–${Math.min(
                (page + 1) * pageSize,
                totalElements
              )} of ${totalElements}`
            : "Showing 0"}
        </span>

        {/* Pagination */}

        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select form-select-sm"
            style={{ width: 80 }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));

              setPage(0);
            }}
          >
            <option value={10}>10</option>

            <option value={20}>20</option>

            <option value={50}>50</option>
          </select>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
