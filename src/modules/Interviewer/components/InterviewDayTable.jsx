import React from "react";
import { Person, FileText } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const InterviewDayTable = ({
  rows = [],
  totalElements = 0,
  page = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  toggleAbsent,
  updateComment,
  updateScore,
  onViewFile,

  // ✅ ADD THESE
  requisition,
  position,
  selectedDate,
  allCandidatesRaw
}) => {

  const navigate = useNavigate();

  /* ✅ NAVIGATION */
  const goToPreview = (row) => {
    navigate("/candidate-preview", {
      state: {
        candidate: row.raw,
        candidateId: row.raw.candidateId,
        applicationId: row.raw.applicationId,
        interviewScheduleId: row.raw.interviewScheduleId,

        positionId: position?.positionId,
        selectedDate,

        candidates: allCandidatesRaw,
        requisition,
        position,
      },
    });
  };

  const totalPages = Math.ceil(totalElements / pageSize);
  const start = totalElements === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="verification-table-wrapper">

      {/* DESKTOP */}
      <div className="d-none d-md-block">
        <table className="table align-middle mb-0 verification-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Category</th>
              <th>Time</th>
              <th>Zone</th>
              <th className="text-center">Absent</th>
              <th>Comment</th>
              <th style={{ width: 120 }}>Score</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No candidates found
                </td>
              </tr>
            )}

            {rows.map(row => (
              <tr key={row.id}>
                <td>
                  <div className="fw-semibold">{row.name}</div>
                  <div className="text-muted fs-12">
                    Reg No: {row.regNo}
                  </div>
                </td>

                <td>{row.category || "-"}</td>
                <td>{row.time}</td>
                <td>{row.zone}</td>

                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={row.absent}
                    onChange={() => toggleAbsent(row.id)}
                  />
                </td>

                <td>
                  <input
                    className="form-control form-control-sm"
                    value={row.comment || ""}
                    onChange={(e) =>
                      updateComment(row.id, e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={row.score || ""}
                    onChange={(e) =>
                      updateScore(row.id, e.target.value)
                    }
                  />
                </td>

                {/* ✅ ACTIONS */}
                <td className="text-center">
                  <Person
                    className="me-3 cursor-pointer"
                    size={18}
                    onClick={() => goToPreview(row)}
                  />

                  <FileText
                    className="cursor-pointer"
                    size={18}
                    onClick={() => onViewFile(row.raw)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 table-footer">
        <span className="text-muted fs-14">
          Showing {start}-{end} of {totalElements}
        </span>

        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 80 }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(+e.target.value)}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
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
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default InterviewDayTable;
