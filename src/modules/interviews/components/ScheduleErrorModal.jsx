import React from "react";

const ScheduleErrorModal = ({
  show,
  onClose,
  errorMessage,
  errorCandidates = []
}) => {

  if (!show) return null;

  return (

    <div className="ipc-alert-overlay">

      <div
        className="ipc-alert-modal"
        style={{
          width: "95%",
          maxWidth: "700px"
        }}
      >

        <h4 className="mb-4">
          Scheduling Failed
        </h4>

        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "15px",
            lineHeight: "1.7"
          }}
        >

          {/* MAIN MESSAGE */}
          <div className="mb-3">

            {errorMessage ||
              "Scheduling failed"}

          </div>

          {/* DETAILED ERRORS */}
          {errorCandidates?.length > 0 && (

            <ul className="mb-0 ps-3">

              {errorCandidates.map(
                (item, index) => (

                <li
                  key={index}
                  className="mb-3"
                >

                  <div>
                    <strong>
                      Application:
                    </strong>{" "}
                    {item.applicationNo}
                  </div>

                  <div>
                    <strong>
                      Conflicting Application:
                    </strong>{" "}
                    {item.conflictingApplicationNo}
                  </div>

                  <div>
                    <strong>
                      Time:
                    </strong>{" "}
                    {item.startTime} -{" "}
                    {item.endTime}
                  </div>

                  <div>
                    <strong>
                      Reason:
                    </strong>{" "}
                    {item.message}
                  </div>

                </li>

              ))}

            </ul>

          )}

        </div>

        <div className="text-end mt-4">

          <button
            className="btn btn-primary"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );
};

export default ScheduleErrorModal;