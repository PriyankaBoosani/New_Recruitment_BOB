import React from "react";
import { useTranslation } from "react-i18next";
import "../../../style/css/InterviewPanelsConfig.css";
import { formatDateDDMMYYYY } from "../../../shared/utils/dateUtils";

const InterviewScheduleTable = ({ rows, position }) => {
  console.log("InterviewScheduleTable render", { rows, position });
  const { t } = useTranslation("interviewSchedule");

  return (
    <div className="schedule-card">

      <div className="schedule-title">
        {t("schedule_title")}
      </div>

      <table className="schedule-table">

        <thead>
          <tr>
            <th>{t("candidate")}</th>
            {/* <th>Position</th> */}
            <th>{t("date")}</th>
            <th>{t("time")}</th>
            <th>{t("zone")}</th>
            <th>{t("panel_details")}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(row => (
            <tr key={row.id}>

              <td>
                <div className="cand-name">{row.name}</div>
              
                <p className="text-muted fs-12 mb-0">
                  Application Number:
                  {" "}
                  {row.regNo}
                </p>
                <p className="text-muted fs-12 mb-0">
                  Position: {position?.find(
                    (p) => p.jobPositions?.positionId === row.positionId
                  )?.masterPositions?.positionName || "-"}
                </p>
              </td>
              {/* <td className="fs-14 align-content-center">
                {position?.find(
                  (p) => p.jobPositions?.positionId === row.positionId
                )?.masterPositions?.positionName || "-"}
              </td> */}
              <td>{formatDateDDMMYYYY(row.date)}</td>
              <td>{row.time}</td>
              <td>{row.zone}</td>
              <td>{row.panel}</td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default InterviewScheduleTable;
