import React, { useState } from "react";
import { Person, FileText } from "react-bootstrap-icons";

export default function InterviewPool({
  selectedIds,
  setSelectedIds,
}) {

  const candidates = [
    {
      id: 1,
      name: "Rajesh Kumar",
      regNo: "961344689",
      date: "12-09-2025",
      time: "09:00 AM - 09:30 AM",
      zone: "Zone 1",
      panel: "Panel 1",
      status: "Interview",
      score: "",
    },
    {
      id: 2,
      name: "Priya Sharma",
      regNo: "961987129",
      date: "12-09-2025",
      time: "09:30 AM - 10:00 AM",
      zone: "Zone 2",
      panel: "Panel 2",
      status: "Interview",
      score: "",
    },
    {
      id: 3,
      name: "Amit Patel",
      regNo: "961963464",
      date: "12-09-2025",
      time: "10:00 AM - 10:30 AM",
      zone: "Zone 3",
      panel: "Panel 3",
      status: "Interview",
      score: "",
    },
  ];

  const allSelected =
    candidates.length > 0 && selectedIds.length === candidates.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : candidates.map((c) => c.id));
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (!candidates.length) {
    return (
      <div className="p-4 text-muted fs-14">
        No candidates in Interview Pool yet.
      </div>
    );
  }

  return (
    <div className="card-body p-0">
      <table className="table table-hover mb-0">
        <thead className="bg-light">
          <tr>
            <th style={{ paddingLeft: "1rem" }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="fs-14 fw-normal py-3">Candidate</th>
            <th className="fs-14 fw-normal py-3">Date</th>
            <th className="fs-14 fw-normal py-3">Time</th>
            <th className="fs-14 fw-normal py-3">Zone</th>
            <th className="fs-14 fw-normal py-3">Panel Details</th>
            <th className="fs-14 fw-normal py-3">Interview Status</th>
            <th className="fs-14 fw-normal py-3">Score</th>
            <th className="text-center fs-14 fw-normal py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((c) => (
            <tr key={c.id}>
              <td style={{ paddingLeft: "1rem" }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.id)}
                  onChange={() => toggleRow(c.id)}
                />
              </td>

              <td>
                <p className="fw-normal fs-14 mb-0">{c.name}</p>
                <p className="text-muted fs-12 mb-0">
                  Reg No: {c.regNo}
                </p>
              </td>

              <td className="fs-14">{c.date}</td>
              <td className="fs-14">{c.time}</td>
              <td className="fs-14">{c.zone}</td>
              <td className="fs-14">{c.panel}</td>

              <td className="align-content-center">
                <span className="round_badge blue-bg px-3 py-1 fs-12 rounded text-white">
                  {c.status}
                </span>
              </td>

              <td>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ width: "70px" }}
                  />
                  <span className="text-danger fw-bold">!</span>
                </div>
              </td>

              <td className="text-center">
                <Person className="me-3 cursor-pointer" />
                <FileText className="cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
