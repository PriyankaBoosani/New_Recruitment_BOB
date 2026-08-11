import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Person, FileText } from "react-bootstrap-icons";
import {useTranslation} from "react-i18next";
export default function ScreeningApprovalTable({
  candidates = [],
  loading = false,
  onViewProfile,
  onViewResume,
  workflowStatus,
}) {
  const isBatchApproved = workflowStatus?.toUpperCase() === "APPROVED";
  const {t} = useTranslation("approvalHistory");

  return (
    <div className="table-wrap">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>{t("candidate")}</th>
            <th>{t("application_number")}</th>
            <th>{t("category")}</th>
            <th>{t("experience")}</th>
            <th>{t("screening_result")}</th>
            {/* <th>{t("status")}</th> */}
            <th className="text-center">{t("actions")}</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                {t("loading_candidates")}
              </td>
            </tr>
          ) : candidates.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">
                {isBatchApproved
                  ? t("no_screening_candidates")
                  : t("no_candidates_found")}
              </td>
            </tr>
          ) : (
            candidates.map((c) => (
              <tr key={c.id || c.appNo}>
                <td>{c.name}</td>
                <td>{c.appNo}</td>
                <td>{c.category}</td>
                <td>{c.exp}</td>

                <td>
                  <span
                    className={`status-badge ${
                      c.result === "Shortlisted"
                        ? "status-approved"
                        : "status-rejected"
                    }`}
                  >
                    {c.result}
                  </span>
                </td>

                {/* <td>{c.workflowStatus || "-"}</td> */}

                <td className="text-center">
                  <OverlayTrigger overlay={<Tooltip>{t("view_profile")}</Tooltip>}>
                    <Person
                      size={17}
                      className="cursor-pointer me-3"
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
          )}
        </tbody>
      </table>
    </div>
  );
}
