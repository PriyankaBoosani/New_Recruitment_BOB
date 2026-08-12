import React, { useState } from "react";

const OnBoardingPool = ({
  data = [],
  totalElements = 0,
  loading = false,
  page = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setSelected(checked ? data.map((d) => d.id) : []);
  };

  const handleSelect = (id, checked) => {
    if (checked) {
      setSelected((prev) => [...prev, id]);
    } else {
      setSelected((prev) => prev.filter((item) => item !== id));
      setSelectAll(false);
    }
  };

  return (
    <div className="card-body p-0">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th className="border-top" style={{ width: "50px" }}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>

            <th className="fs-14 fw-normal py-3 border-top">Candidate</th>
            <th className="fs-14 fw-normal py-3 border-top">
              Application Number
            </th>
            <th className="fs-14 fw-normal py-3 border-top">
              Offer Letter Number
            </th>
            <th className="fs-14 fw-normal py-3 border-top">
              Offer Release Date
            </th>
            <th className="fs-14 fw-normal py-3 border-top">
              Accept Before Date
            </th>
            <th className="fs-14 fw-normal py-3 border-top">
              Offer Extended Date
            </th>
            <th className="fs-14 fw-normal py-3 border-top">Joining Date</th>
            <th className="fs-14 fw-normal py-3 border-top">
              Onboarding Status
            </th>
            <th className="fs-14 fw-normal py-3 border-top">Medical Status</th>
            <th className="fs-14 fw-normal py-3 border-top text-center">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {data?.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={(e) => handleSelect(row.id, e.target.checked)}
                  />
                </td>

                <td>{row.candidate}</td>
                <td>{row.applicationNo}</td>
                <td>{row.offerLetterNo}</td>
                <td>{row.offerReleaseDate}</td>
                <td>{row.acceptBeforeDate}</td>
                <td>{row.offerExtendedDate}</td>
                <td>{row.joiningDate}</td>
                <td>{row.onboardingStatus}</td>
                <td>{row.medicalStatus}</td>

                <td>
                  <button className="btn btn-sm btn-primary">View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center py-4">
                No candidate details found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
        <div className="fs-14 text-muted">
          Showing{" "}
          {totalElements > 0
            ? `${page * pageSize + 1}–${Math.min(
                (page + 1) * pageSize,
                totalElements
              )}`
            : "0"}{" "}
          of {totalElements}
        </div>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select fs-14"
            style={{ width: "90px" }}
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(0);
            }}
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={(page + 1) * pageSize >= totalElements}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPool;
