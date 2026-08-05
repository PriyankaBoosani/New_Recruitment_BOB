import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Person, FileText } from "react-bootstrap-icons";

export default function ScreeningApprovalTable({
  candidates = [],
  loading = false,
  onViewProfile,
  onViewResume,
  workflowStatus,
}) {
  const isBatchApproved = workflowStatus?.toUpperCase() === "APPROVED";

  return (
    <div className="table-wrap">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Candidate</th>
            <th>Application Number</th>
            <th>Category</th>
            <th>Experience</th>
            <th>Screening Result</th>
            {/* <th>Status</th> */}
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                Loading candidates...
              </td>
            </tr>
          ) : candidates.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-muted">
                {isBatchApproved
                  ? "No screening candidates found. Shortlisted candidates are moved to the Interview Approval tab."
                  : "No candidates found"}
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
                  <OverlayTrigger overlay={<Tooltip>View Profile</Tooltip>}>
                    <Person
                      size={17}
                      className="cursor-pointer me-3"
                      onClick={() => onViewProfile(c)}
                    />
                  </OverlayTrigger>

                  <OverlayTrigger overlay={<Tooltip>View Resume</Tooltip>}>
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
