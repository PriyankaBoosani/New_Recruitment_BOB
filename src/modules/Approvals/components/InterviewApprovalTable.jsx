import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Person, FileText } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
export default function InterviewApprovalTable({
  candidates,
  onViewProfile,
  onViewResume,
  loading
}) 
{
  const {t} = useTranslation("approvalHistory");
  return (
    <div className="table-wrap">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>{t("candidate")}</th>
            <th>{t("application_number")}</th>
            <th>{t("category")}</th>
            <th>{t("zone")}</th>
            <th>{t("panel_details")}</th>
            <th>{t("score")}</th>
            <th>{t("interview_result")}</th>
            <th className="text-center">{t("actions")}</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">{t("loading_candidates")}</span>
                </div>
              </td>
            </tr>
          ) : candidates.length > 0 ? (
            candidates.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                 <td>{c.appNo}</td>
                <td>{c.category}</td>
                <td>{c.zone}</td>
                <td>{c.panel}</td>
                <td>{c.score}</td>
                <td>
                  <span
                    className={`status-badge ${
                      c.status === "Qualified"
                        ? "status-approved"
                        : "status-rejected"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="text-center">
                  <OverlayTrigger overlay={<Tooltip>{t("view_profile")}</Tooltip>}>
                    <Person
                      size={17}
                      className="me-3 cursor-pointer"
                      onClick={() => onViewProfile(c)}
                    />
                  </OverlayTrigger>

                  <OverlayTrigger overlay={<Tooltip>{t("view_resume")}</Tooltip>}>
                    <FileText
                      size={17}
                      className="cursor-pointer"
                      onClick={() => onViewResume(c)}
                    />
                  </OverlayTrigger>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-muted">
                {t("no_candidates_found")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
