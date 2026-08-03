import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Person, FileText } from "react-bootstrap-icons";

export default function InterviewApprovalTable({
  candidates,
  onViewProfile,
  onViewResume,
}) {
  return (
    <div className="table-wrap">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Candidate</th>
            <th>Category</th>
            <th>Zone</th>
            <th>Panel Details</th>
            <th>Score</th>
            <th>Interview Result</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.category}</td>
              <td>{c.zone}</td>
              <td>{c.panel}</td>
              <td>{c.score}</td>
              <td>{c.status}</td>

              <td className="text-center">
                <OverlayTrigger overlay={<Tooltip>View Profile</Tooltip>}>
                  <Person
                    size={17}
                    className="me-3 cursor-pointer"
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
