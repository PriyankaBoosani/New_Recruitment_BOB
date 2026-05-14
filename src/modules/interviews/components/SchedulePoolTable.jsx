import React from "react";
import {
  Person,
  FileText
} from "react-bootstrap-icons";

import {
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";

import { useTranslation } from "react-i18next";


const SchedulePoolTable = ({
  rows,
  onEdit,
  onSubmitApproval,
  page,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
  onViewProfile,
  onViewResume,
  onOpenZonalComments
}) => {

  const { t } = useTranslation([
    "candidateWorkflow",
    "common",
    "interviewSchedule"
  ]);

  return (

    <div className="card-body p-0 interview-pool">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">

        <h6 className="mb-0 blue-color">
          Schedule Pool
        </h6>

        <div className="d-flex gap-2 schddis">

          <button
            className="btn btn-primary fs-14"
            onClick={onSubmitApproval}
            disabled={rows.length === 0}
          >
            Submit for Approval
          </button>

          <button
            className="btn btn-primary fs-14"
            onClick={onEdit}
            disabled={rows.length === 0}
          >
            Edit Schedule
          </button>

        </div>

      </div>

      {/* TABLE */}
      <table className="table table-hover mb-0">

        <thead className="bg-light">

          <tr>

            <th className="fs-14 fw-normal py-3">
              {t("candidateWorkflow:candidate")}
            </th>

            <th className="fs-14 fw-normal py-3">
              {t("common:date")}
            </th>

            <th className="fs-14 fw-normal py-3">
              {t("common:time")}
            </th>

            <th className="fs-14 fw-normal py-3">
              {t("candidateWorkflow:zone")}
            </th>

            <th className="fs-14 fw-normal py-3">
              {t("candidateWorkflow:panel_details")}
            </th>

            <th className="fs-14 fw-normal py-3">
              {t("candidateWorkflow:interview_status")}
            </th>

            <th className="text-center fs-14 fw-normal py-3">
              {t("common:actions")}
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.length === 0 ? (

            <tr>

              <td
                colSpan="7"
                className="text-center py-4 text-muted fs-14"
              >
                No candidates in Schedule Pool yet.
              </td>

            </tr>

          ) : (

            rows.map((row) => (

              <tr key={row.id}>

                {/* Candidate */}
                <td className="align-content-center">

                  <p className="fw-normal fs-14 mb-0">
                    {row.name}
                  </p>

                  <p className="text-muted fs-12 mb-0">
                    {t("interviewSchedule:reg_no")}:
                    {" "}
                    {row.regNo}
                  </p>

                </td>

                {/* Date */}
                <td className="fs-14 align-content-center">
                  {row.date}
                </td>

                {/* Time */}
                <td className="fs-14 align-content-center">
                  {row.time}
                </td>

                {/* Zone */}
                <td className="fs-14 align-content-center">
                  {row.zone}
                </td>

                {/* Panel */}
                <td className="fs-14 align-content-center">
                  {row.panel}
                </td>

                {/* Interview Status */}
                <td className="align-content-center">

               {row.interviewStatus === "L1_PENDING" ? "L1 Pending" : row.interviewStatus}
                </td>

                {/* Actions */}
                <td className="text-center align-content-center">

                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip>
                        View Profile
                      </Tooltip>
                    }
                  >

                    <Person
                      className="me-3 cursor-pointer"
                      onClick={() =>
                        onViewProfile?.(row)
                      }
                    />

                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip>
                        View Resume
                      </Tooltip>
                    }
                  >

                    <FileText
                      className="cursor-pointer"
                      onClick={() =>
                        onViewResume?.(row)
                      }
                    />

                  </OverlayTrigger>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

      {/* FOOTER */}
      <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">

        <div className="fs-14 text-muted">

          Showing{" "}

          {rows.length === 0
            ? 0
            : page * pageSize + 1}

          –

          {Math.min(
            (page + 1) * pageSize,
            totalElements
          )}

          {" "}of{" "}

          {totalElements}

        </div>

        <div className="d-flex align-items-center gap-2">

          <select
            className="form-select fs-14"
            style={{ width: "90px" }}
            value={pageSize}
            onChange={(e) => {

              onPageSizeChange(
                Number(e.target.value)
              );

              onPageChange(0);

            }}
          >

            {[10, 20, 50].map((s) => (

              <option
                key={s}
                value={s}
              >
                {s}
              </option>

            ))}

          </select>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 0}
            onClick={() =>
              onPageChange(page - 1)
            }
          >
            Prev
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={
              (page + 1) * pageSize >=
              totalElements
            }
            onClick={() =>
              onPageChange(page + 1)
            }
          >
            Next
          </button>

        </div>

      </div>

    </div>

  );

};

export default SchedulePoolTable;