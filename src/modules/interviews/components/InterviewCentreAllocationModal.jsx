import React from "react";

const InterviewCentreAllocationModal = ({
  show,
  onClose,
  uniqueAllocatedCentres,
  centreRows,
  setCentreRows,
  allInterviewCentres,
  onContinue,
}) => {
  console.log("centreRows", centreRows);
  console.log("allInterviewCentres", allInterviewCentres);
  console.log("uniqueAllocatedCentres", uniqueAllocatedCentres);

  if (!show) return null;

  const selectedAllocatedCentres = centreRows.map((r) => r.allocatedCentreId).filter(Boolean);

  const candidateCentreIds = uniqueAllocatedCentres.map((c) => c.interviewCentreId);

  return (
    <div className="ipc-alert-overlay">
      <div className="ipc-alert-modal centre-modal">
        <h4 className="ipc-alert-title">Update Interview Centre Allocation</h4>

        <p className="ipc-alert-message">
          Replace unavailable interview centres before continuing.
        </p>

        <div className="table-responsive mt-4">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Allocated Interview Centre</th>
                <th>Replace With</th>
              </tr>
            </thead>

            <tbody>
              {centreRows.map((row, index) => (
                <tr key={index}>
                  {/* LEFT */}
                  <td style={{ minWidth: "260px" }}>
                    <select
                      className="form-select"
                      value={row.allocatedCentreId}
                      onChange={(e) => {
                        const updated = [...centreRows];

                        updated[index].allocatedCentreId = e.target.value;

                        setCentreRows(updated);
                      }}
                    >
                      <option value="">Select Centre</option>

                      {uniqueAllocatedCentres
                        .filter((c) => {
                          // allow current row selected value
                          if (c.interviewCentreId === row.allocatedCentreId) {
                            return true;
                          }

                          // prevent duplicate rows
                          return !centreRows.some(
                            (r, idx) => idx !== index && r.allocatedCentreId === c.interviewCentreId
                          );
                        })
                        .map((c) => (
                          <option key={c.interviewCentreId} value={c.interviewCentreId}>
                            {c.interviewCentre}
                          </option>
                        ))}
                    </select>
                  </td>

                  {/* RIGHT */}
                  <td style={{ minWidth: "260px" }}>
                    <div className="d-flex gap-2 align-items-center">
                      <select
                        className="form-select"
                        value={row.replacedCentreId}
                        onChange={(e) => {
                          const updated = [...centreRows];

                          updated[index].replacedCentreId = e.target.value;

                          setCentreRows(updated);
                        }}
                      >
                        <option value="">Select Replacement</option>

                        {allInterviewCentres
                          .filter(
                            (c) =>
                              // left & right should not match
                              c.interviewCentreId !== row.allocatedCentreId
                          )
                          .map((c) => (
                            <option key={c.interviewCentreId} value={c.interviewCentreId}>
                              {c.displayName}
                            </option>
                          ))}
                      </select>

                      {/* ADD BUTTON */}
                      {index === centreRows.length - 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => {
                            setCentreRows([
                              ...centreRows,

                              {
                                allocatedCentreId: "",
                                replacedCentreId: "",
                              },
                            ]);
                          }}
                        >
                          +
                        </button>
                      )}

                      {/* REMOVE BUTTON */}
                      {centreRows.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            const updated = centreRows.filter((_, i) => i !== index);

                            setCentreRows(updated);
                          }}
                        >
                          -
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-light" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={onContinue}>
            Continue Scheduling
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCentreAllocationModal;
