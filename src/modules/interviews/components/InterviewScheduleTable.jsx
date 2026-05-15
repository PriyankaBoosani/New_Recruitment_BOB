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
            <th>Position</th>
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
                <div className="cand-reg">
                  {t("reg_no")}: {row.regNo}
                </div>
              </td>
             <td className="fs-14 align-content-center">
  {position?.find(
    (p) => p.jobPositions?.positionId === row.positionId
  )?.masterPositions?.positionName || "-"}
</td>
              <td>{(row.date)}</td>
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
