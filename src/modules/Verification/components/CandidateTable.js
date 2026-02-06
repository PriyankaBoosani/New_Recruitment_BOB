import React from "react";
import { Person, FileText } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const CandidateTable = ({
  requisition,
  position,
  isSelectionDone,
  filteredCandidates,
  toggleAbsent,
  selectedDate,
  allCandidatesRaw 
}) => {


  const navigate = useNavigate();
  
    //    console.log("Fetching job details for position ID@@@@@@@@@@@@@@@@@@:", position.positionId);
const goToPreview = (c) => {

      console.log("RAW CANDIDATE:@@@@@@@@@@@@@@@@@@@@@@@@@@@@", c.raw);   //  ADD
  navigate("/candidate-preview", {
    state: {
      candidate: c.raw,   //  send full original candidate
      candidateId: c.raw.candidateId,   //  explicit id
       applicationId: c.raw.applicationId,
        interviewScheduleId: c.raw.interviewScheduleId,
      positionId: position?.positionId,
       selectedDate, 

        candidates: allCandidatesRaw,

     requisition,
position,

    },
  });
};





  return (
    <div className="verification-table-wrapper">

      {/* ================= DESKTOP TABLE ================= */}
      <div className="d-none d-md-block">
        <table className="table align-middle mb-0 verification-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Category</th>
              <th>Time</th>
              <th>Zone</th>
              <th className="text-center">Absent</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!isSelectionDone && (
              <tr className="no-candidates-row">
                <td colSpan="7" className="text-center py-4 text-muted">
                  No candidates found
                </td>
              </tr>
            )}

            {isSelectionDone && filteredCandidates.length === 0 && (
              <tr className="no-candidates-row">
                <td colSpan="7" className="text-center py-4 text-muted">
                  No candidates found
                </td>
              </tr>
            )}

            {isSelectionDone &&
              filteredCandidates.length > 0 &&
              filteredCandidates.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="fw-semibold">{c.name}</div>
                    <div className="text-muted fs-12">
                      Reg No: {c.regNo}
                    </div>
                  </td>

                  <td>{c.category}</td>
                  <td>{c.time}</td>
                  <td>{c.zone}</td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={c.absent}
                      onChange={() => toggleAbsent(c.id)}
                    />
                  </td>

                  <td>
                    <span
                      className={`status-badge ${c.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="text-center">
                    <Person
                      className="me-3 cursor-pointer"
                      onClick={() => goToPreview(c)}
                    />
                    <FileText
                      className="cursor-pointer"
                      onClick={() => goToPreview(c)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="d-block d-md-none">

        {!isSelectionDone || filteredCandidates.length === 0 ? (
          <div className="text-center py-4 text-muted">
            No candidates found
          </div>
        ) : (
          filteredCandidates.map((c) => (
            <div key={c.id} className="candidate-card">

              <div className="card-top">
                <div>
                  <div className="fw-semibold">{c.name}</div>
                  <div className="text-muted fs-12">
                    Reg No: {c.regNo}
                  </div>
                </div>

                <span
                  className={`status-badge ${c.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {c.status}
                </span>
              </div>

              <div className="card-grid">
                <div>
                  <label>Category</label>
                  <div>{c.category}</div>
                </div>

                <div>
                  <label>Time</label>
                  <div>{c.time}</div>
                </div>

                <div>
                  <label>Zone</label>
                  <div>{c.zone}</div>
                </div>

                <div>
                  <label>Absent</label>
                  <input
                    type="checkbox"
                    checked={c.absent}
                    onChange={() => toggleAbsent(c.id)}
                  />
                </div>
              </div>

              <div className="card-actions">
                <Person
                  className="me-3 cursor-pointer"
                  onClick={() => goToPreview(c)}
                />
                <FileText
                  className="cursor-pointer"
                  onClick={() => goToPreview(c)}
                />
              </div>

            </div>
          ))
        )}

      </div>

      {/* ================= FOOTER ================= */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 table-footer">
        <span className="text-muted fs-14">
          Showing {isSelectionDone ? filteredCandidates.length : 0}
        </span>

        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 70 }}
          >
            <option>10</option>
          </select>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled
          >
            Prev
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default CandidateTable;
    