import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function CandidatePool({ candidates, selectedIds, setSelectedIds, onView }) {
	const STATUS_CLASS_MAP = {
		Applied: "bg-secondary",
		Shortlisted: "bg-warning",
		Discrepency: "bg-primary",
		Rejected: "bg-danger",
	};
	const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  /* ---------- Selection logic ---------- */

  const allSelected =
    candidates.length > 0 && selectedIds.length === candidates.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map((c) => c.id));
    }
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ---------- Sorting logic ---------- */

  const requestSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedCandidates = useMemo(() => {
    if (!sortConfig.key) return candidates;

    return [...candidates].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [candidates, sortConfig]);

  const sortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  /* ---------- Render ---------- */

  return (
    <>
      {/* Desktop Table */}
      <div className="card-body p-0 d-none d-md-block">
        <table className="table table-hover mb-0">
          <thead className="bg-light">
            <tr>
              <th className="fs-14 fw-normal py-3" style={{ paddingLeft: '1rem' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>

              <th className="fs-14 fw-normal py-3" onClick={() => requestSort("name")} role="button">
                Candidate {sortIcon("name")}
              </th>

							<th className="fs-14 fw-normal py-3" onClick={() => requestSort("rank")} role="button">
                Rank {sortIcon("rank")}
              </th>

							<th className="fs-14 fw-normal py-3" onClick={() => requestSort("score")} role="button">
                Score {sortIcon("score")}
              </th>

              <th className="fs-14 fw-normal py-3" onClick={() => requestSort("experience")} role="button">
                Experience {sortIcon("experience")}
              </th>

              <th className="fs-14 fw-normal py-3" onClick={() => requestSort("status")} role="button">
                Status {sortIcon("status")}
              </th>

              <th className="fs-14 fw-normal py-3" onClick={() => requestSort("location")} role="button">
                Location {sortIcon("location")}
              </th>

              <th className="fs-14 fw-normal py-3" onClick={() => requestSort("category")} role="button">
                Category {sortIcon("category")}
              </th>

              <th className="text-center fs-14 fw-normal py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedCandidates.map((c) => (
              <tr key={c.id}>
                <td className="align-content-center" style={{ paddingLeft: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggleRow(c.id)}
                  />
                </td>

                <td className="align-content-center">
                  <p className="fw-normal fs-14 mb-0">{c.name}</p>
                  <p className="text-muted fs-12 mb-0">
                    Reg No: {c.regNo}
                  </p>
                </td>

								<td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{c?.rank || "-"}</p>
								</td>

								<td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{c?.score || "-"}</p>
								</td>

                <td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{c.experience}</p>
								</td>

                <td className="align-content-center">
                  <span
										className={`px-3 py-1 fs-12 rounded text-white ${
											STATUS_CLASS_MAP[c.status] || "bg-secondary"
										}`}
									>
										{c.status}
									</span>
                </td>

                <td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{c.location}</p>
								</td>

                <td className="align-content-center">
									<p className="fw-normal fs-14 mb-0">{c.category}</p>
								</td>

                <td className="text-center align-content-center">
                  <button className="btn btn-sm btn-outline-primary me-2"
										onClick={() =>
											navigate("/candidate-preview", {
												state: { candidate: c },
											})
										}
									>
                    View
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    Docs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (NO checkboxes here on purpose) */}
      <div className="d-md-none">
        {candidates.map((c) => (
          <div key={c.id} className="card mb-3">
            <div className="card-body">
              <h6 className="fw-bold mb-1">{c.name}</h6>
              <small className="text-muted d-block mb-2">
                Reg No: {c.regNo}
              </small>

              <div className="mb-1">
                <strong>Experience:</strong> {c.experience}
              </div>
              <div className="mb-1">
                <strong>Status:</strong>{" "}
                <span
									className={`px-3 py-1 fs-12 rounded text-white ${
										STATUS_CLASS_MAP[c.status] || "bg-secondary"
									}`}
								>
									{c.status}
								</span>
              </div>
              <div className="mb-1">
                <strong>Location:</strong> {c.location}
              </div>
              <div className="mb-2">
                <strong>Category:</strong> {c.category}
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary w-50"
									onClick={() =>
										navigate("/candidate-preview", {
											state: { candidate: c },
										})
									}
								>
                  View
                </button>
                <button className="btn btn-sm btn-outline-secondary w-50">
                  Docs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
