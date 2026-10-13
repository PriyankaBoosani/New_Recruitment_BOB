import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../../style/css/InterviewPanelsConfig.css";
import { formatDateDDMMYYYY } from "../../../shared/utils/dateUtils";
import { Modal } from "react-bootstrap";

const InterviewScheduleTable = ({
  rows = [],
  position,
  isSchedulingOngoing = false,
  page: externalPage = 0,
  pageSize: externalPageSize = 10,
  totalElements: externalTotalElements = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation("interviewSchedule");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showRemark, setShowRemark] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState("");

  const currentPage = isSchedulingOngoing ? externalPage : page;

  const currentPageSize = isSchedulingOngoing ? externalPageSize : pageSize;

  const totalElements = isSchedulingOngoing
    ? Number(externalTotalElements || 0)
    : rows.length;

  const paginatedRows = isSchedulingOngoing
    ? rows
    : rows.slice(page * pageSize, (page + 1) * pageSize);

  const totalPages = Math.ceil(totalElements / currentPageSize);

  return (
    <div className="schedule-card">
      <div className="schedule-title">{t("schedule_title")}</div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th style={{ width: "32%" }}>{t("candidate")}</th>

            <th style={{ width: "16%" }}>{t("date")}</th>

            <th style={{ width: "16%" }}>{t("time")}</th>

            <th style={{ width: "16%" }}>{t("zone")}</th>

            <th style={{ width: "20%" }}>{t("panel_details")}</th>
            <th style={{ width: "20%" }}>{t("status")}</th>
          </tr>
        </thead>

        <tbody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className="cand-name">{row.name}</div>

                  <p className="text-muted fs-12 mb-0">
                    Application Number: {row.regNo}
                  </p>

                  <p className="text-muted fs-12 mb-0">
                    Position:{" "}
                    {position?.find(
                      (p) => p.jobPositions?.positionId === row.positionId
                    )?.masterPositions?.positionName || "-"}
                  </p>
                </td>

                <td>{formatDateDDMMYYYY(row.date)}</td>

                <td>{row.time}</td>

                <td>{row.zone}</td>

                <td>{row.panel}</td>
              
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className={`custom-badge ${
                          row.interviewSchedulingJobStatus?.toUpperCase() ===
                          "SCHEDULED"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {row.interviewSchedulingJobStatus?.toUpperCase() ===
                        "SCHEDULED"
                          ? "Scheduled"
                          : "Not Scheduled"}
                      </span>

                      {row.interviewSchedulingJobStatus?.toUpperCase() !==
                        "SCHEDULED" &&
                        row.remarks && (
                          <button
                            type="button"
                            className="btn btn-link p-0"
                            title="View remark"
                            onClick={() => {
                              setSelectedRemark(row.remarks);
                              setShowRemark(true);
                            }}
                          >
                            <i className="bi bi-info-circle text-danger"></i>
                          </button>
                        )}
                    </div>
                 
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">
                No candidates found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
        <div className="fs-14 text-muted">
          Showing {totalElements === 0 ? 0 : currentPage * currentPageSize + 1}
          {" – "}
          {Math.min((currentPage + 1) * currentPageSize, totalElements)} of{" "}
          {totalElements}
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* PAGE SIZE */}
          <select
            className="form-select fs-14"
            style={{ width: "90px" }}
            value={currentPageSize}
            onChange={(e) => {
              const size = Number(e.target.value);

              if (isSchedulingOngoing) {
                onPageSizeChange(size);
              } else {
                setPageSize(size);
                setPage(0);
              }
            }}
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* PREVIOUS */}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage <= 0}
            onClick={() => {
              const newPage = currentPage - 1;

              if (isSchedulingOngoing) {
                onPageChange(newPage);
              } else {
                setPage(newPage);
              }
            }}
          >
            Prev
          </button>

          {/* NEXT */}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage >= totalPages - 1 || totalPages === 0}
            onClick={() => {
              const newPage = currentPage + 1;

              if (isSchedulingOngoing) {
                onPageChange(newPage);
              } else {
                setPage(newPage);
              }
            }}
          >
            Next
          </button>
        </div>
        <Modal show={showRemark} onHide={() => setShowRemark(false)} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="schedule-popup">Scheduling Remark</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="text-muted">
              {selectedRemark || "No remark available."}
            </div>
          </Modal.Body>

          <Modal.Footer className="border-0">
            <button
              type="button"
              className="btn blue-bg text-white"
              onClick={() => setShowRemark(false)}
            >
              OK
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default InterviewScheduleTable;
