import React from "react";
import { Person, FileText } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

 
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
 
  //  ADD THESE
  requisition,
  position,
  selectedDate,
  allCandidatesRaw
}) => {
 
  const navigate = useNavigate();
 
  /*  NAVIGATION */
const goToPreview = (row) => {
  console.log(" NAVIGATING WITH:", row);
 
  const posId =
    position?.raw?.positionId ||
    position?.position?.positionId ||
    position?.positionId ||
    position?.value ||
    null;
 
  console.log(" NAV POS ID:", posId);
 
  navigate("/candidate-preview", {
    state: {
      candidate: row.raw,
      candidateId: row.raw.candidateId,
      applicationId: row.raw.applicationId,
      interviewScheduleId: row.raw.interviewScheduleId,
      positionId: posId,
      selectedDate,
      candidates: allCandidatesRaw,
      requisition,
      position,
    },
  });
};
 
 
 
 
 
  console.log("📊 TABLE ROWS RECEIVED:", rows);
console.log("📊 TOTAL ELEMENTS:", totalElements);
 
 
  const totalPages = Math.ceil(totalElements / pageSize);
  const start = totalElements === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);
 
  return (
    <div className="verification-table-wrapper">
 
      {/* DESKTOP */}
      <div className="d-none d-md-block">
        <table className="table align-middle mb-0 verification-table">
        <thead className="fs-14">
 
            <tr>
            <th className="fs-14">Candidate</th>
<th className="fs-14">Category</th>
<th className="fs-14">Time</th>
<th className="fs-14">Zone</th>
<th className="fs-14 text-center">Absent</th>
<th className="fs-14">Comment</th>
<th className="fs-14" style={{ width: 120 }}>Score</th>
<th className="fs-14 text-center">Actions</th>
 
            </tr>
          </thead>
 
          <tbody>
            {rows.length === 0 && (
             <tr>
  <td colSpan="8" className="text-center py-4 text-muted fs-15">
    No candidates found
  </td>
</tr>
 
            )}
 
            {rows.map(row => (
              <tr key={row.id}>
                <td>
                <div className="fw-semibold fs-14">{row.name}</div>
                  <div className="text-muted fs-12">
                    Reg No: {row.regNo}
                  </div>
                </td>
 
              <td className="fs-14">{row.category || "-"}</td>
<td className="fs-14">{row.time}</td>
<td className="fs-14">{row.zone}</td>
 
 
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={row.absent}
                    onChange={() => toggleAbsent(row.id)}
                  />
                </td>
 
                <td>
                <input
  className="form-control form-control-sm fs-14"
                    value={row.comment || ""}
                    onChange={(e) =>
                      updateComment(row.id, e.target.value)
                    }
                  />
                </td>
 
                <td>
        {/* <input
  type="number"
  className="form-control form-control-sm fs-14"
  value={row.score || ""}
  disabled={row.absent}
  min={0}
  max={100}
  step={1}
  onChange={(e) => {
    let v = e.target.value;
 
    if (v === "") {
      updateScore(row.id, "");
      return;
    }
 
    v = parseInt(v, 10);
 
    if (v > 100) v = 100;
    if (v < 0) v = 0;
 
    updateScore(row.id, v);
  }}
  onKeyDown={(e) => {
    if (e.key === "e" || e.key === "-" || e.key === "+") {
      e.preventDefault();
    }
  }}
/> */}
 
 
 
 
 
 
 <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  className="form-control form-control-sm fs-14"
  value={row.score ?? ""}
  disabled={row.absent}
  maxLength={3}
  onChange={(e) => {
    let v = e.target.value;
 
    // allow empty
    if (v === "") {
      updateScore(row.id, "");
      return;
    }
 
    // keep only digits
    v = v.replace(/\D/g, "");
 
    // clamp 0–100
    const num = Math.min(100, Math.max(0, parseInt(v, 10)));
 
    updateScore(row.id, num);
  }}
  onPaste={(e) => {
    const text = e.clipboardData.getData("text");
    if (!/^\d+$/.test(text)) {
      e.preventDefault();
    }
  }}
/> 
 
 
 
                </td>
 
                {/* ✅ ACTIONS */}
              <td className="text-center">

  <OverlayTrigger
    placement="bottom"
    overlay={<Tooltip>View Profile</Tooltip>}
  >
    <span>
      <Person
        className="me-3 cursor-pointer"
        size={16}
        onClick={() => goToPreview(row)}
      />
    </span>
  </OverlayTrigger>

  <OverlayTrigger
    placement="bottom"
    overlay={<Tooltip>View Resume</Tooltip>}
  >
    <span>
      <FileText
        className="cursor-pointer"
        size={16}
        onClick={() => onViewFile(row.raw)}
      />
    </span>
  </OverlayTrigger>

</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* FOOTER */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 table-footer">
        <span className="text-muted fs-13">
          Showing {start}-{end} of {totalElements}
        </span>
 
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 70 }}
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