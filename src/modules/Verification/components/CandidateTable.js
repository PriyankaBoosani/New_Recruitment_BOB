import React from "react";
import { Person, FileText } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";


const CandidateTable = ({
  requisition,
  position,
  isSelectionDone,
  filteredCandidates,
  toggleAbsent,
  selectedDate,
  allCandidatesRaw,
  onViewFile,
  totalElements,
  page,
  pageSize,
  totalPages,
  setPage,
  setPageSize
}) => {


  const navigate = useNavigate();

  //    console.log("Fetching job details for position ID@@@@@@@@@@@@@@@@@@:", position.positionId);
  const goToPreview = (c) => {

    console.log("RAW CANDIDATE:", c.raw);

    navigate("/candidate-preview", {
      state: {
        candidate: c.raw,
        candidateId: c.raw.candidateId,
        applicationId: c.raw.applicationId,
        interviewScheduleId: c.raw.interviewScheduleId,

        positionId:
          position?.raw?.positionId ||
          position?.positionId ||
          position?.value ||
          null,

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
          <thead className="fs-14">

            <tr>
              <th className="fs-14">Candidate</th>
              <th className="fs-14">Category</th>
              <th className="fs-14">Time</th>
              <th className="fs-14">Zone</th>
              <th className="fs-14 text-center">Absent</th>
              <th className="fs-14">Status</th>
              <th className="fs-14 text-center">Actions</th>

            </tr>
          </thead>

          <tbody>
            {!isSelectionDone && (
              <tr className="no-candidates-row">
                <td colSpan="7" className="text-center py-4 text-muted fs-15">
                  No candidates found
                </td>
              </tr>
            )}

            {isSelectionDone && filteredCandidates.length === 0 && (
              <tr className="no-candidates-row">
                <td colSpan="7" className="text-center py-4 text-muted fs-15">
                  No candidates found
                </td>
              </tr>
            )}


            {isSelectionDone &&
              filteredCandidates.length > 0 &&
              filteredCandidates.map((c) => {

                const isRejected =
                  c.status === ""



                return (

                  <tr key={c.id}>
                    <td>
                      <div className="fw-semibold fs-14">{c.name}</div>
                      <div className="text-muted fs-12">
                        Application Number: {c.regNo}
                      </div>
                    </td>

                    <td className="fs-14">{c.category}</td>
                    <td className="fs-14">{c.time}</td>
                    <td className="fs-14">{c.zone}</td>

                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={c.absent}
                        disabled={
                          c.status !== "Pending" &&
                          c.status !== "Zonal Absent"
                        }

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

                      {/* View Profile */}
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>View Profile</Tooltip>}
                      >
                        <span>
                          <Person
                            size={16}
                           className="me-3 cursor-pointer"
style={{ cursor: "pointer" }}
onClick={() => goToPreview(c)}

                          />

                        </span>
                      </OverlayTrigger>

                      {/* View Resume */}
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip>View Resume</Tooltip>}
                      >
                        <span>
                          <FileText
                            size={16}
                            className="cursor-pointer"
                            onClick={() => onViewFile(c.raw)}
                          />
                        </span>
                      </OverlayTrigger>

                    </td>

                  </tr>
                );
              }
              )}
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
          filteredCandidates.map((c) => {

            const isRejected =
              c.status === ""



            return (

              <div key={c.id} className="candidate-card">

                <div className="card-top">
                  <div>
                    <div className="fw-semibold fs-14">{c.name}</div>
                    <div className="text-muted fs-12">
                      Application Number: {c.regNo}
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
                    <label className="fs-12 text-muted">Category</label>


                    <div className="fs-14">{c.category}</div>
                  </div>

                  <div>
                    <label className="fs-12 text-muted">Time</label>
                    <div className="fs-14">{c.time}</div>


                  </div>

                  <div>
                    <label className="fs-12 text-muted">Zone</label>
                    <div className="fs-14">{c.zone}</div>


                  </div>

                  <div>
                    <label className="fs-12 text-muted">Absent</label>
                    <input
                      type="checkbox"
                      checked={c.absent}
                      disabled={
                        c.status !== "Pending" &&
                        c.status !== "Zonal Absent"
                      }

                      onChange={() => toggleAbsent(c.id)}
                    />



                  </div>
                </div>

                <div className="card-actions">
                  <Person
                    size={16}
                   className="me-3 cursor-pointer"
style={{ cursor: "pointer" }}
onClick={() => goToPreview(c)}

                  />



                  <FileText size={16}

                    className="cursor-pointer"
                    onClick={() => onViewFile(c.raw)}
                  />

                </div>

              </div>
            );
          })

        )}

      </div>

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

        {/* Pagination controls */}
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
            onClick={() => setPage(prev => prev - 1)}
          >
            Prev
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(prev => prev + 1)}
          >
            Next
          </button>

        </div>
      </div>


    </div>
  );
};

export default CandidateTable;
