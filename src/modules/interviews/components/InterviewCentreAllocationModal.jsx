import React from "react";

const InterviewCentreAllocationModal = ({
  show,
  onClose,
  uniqueAllocatedCentres,
  centreMappings,
  setCentreMappings,
  allInterviewCentres,
  onContinue
}) => {

  if (!show) return null;

  return (

    <div className="ipc-alert-overlay">

      <div className="ipc-alert-modal centre-modal">

        <h4 className="ipc-alert-title">
          Update Interview Centre Allocation
        </h4>

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

              {uniqueAllocatedCentres.map((centre) => (

                <tr key={centre.interviewCentreId}>

                  {/* LEFT */}
                  <td style={{ minWidth: "260px" }}>

                    <select
                      className="form-select"
                      value={centre.interviewCentreId}
                      disabled
                    >
                      <option>
                        {centre.interviewCentre}
                      </option>
                    </select>

                  </td>

                  {/* RIGHT */}
                  <td style={{ minWidth: "260px" }}>

                    <select
                      className="form-select"
                      value={
                        centreMappings[
                          centre.interviewCentreId
                        ] || ""
                      }
                      onChange={(e) => {

                        setCentreMappings(prev => ({
                          ...prev,
                          [centre.interviewCentreId]:
                            e.target.value
                        }));

                      }}
                    >

                      {allInterviewCentres.map(c => (

                        <option
                          key={c.interviewCentreId}
                          value={c.interviewCentreId}
                        >
                          {c.interviewCentre}
                        </option>

                      ))}

                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div className="d-flex justify-content-end gap-2 mt-4">

          <button
            className="btn btn-light"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={onContinue}
          >
            Continue Scheduling
          </button>

        </div>

      </div>

    </div>

  );
};

export default InterviewCentreAllocationModal;