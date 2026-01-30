import React from "react";
import { Table, Form } from "react-bootstrap";

import { useTranslation } from "react-i18next";

const UserTable = ({ data, searchTerm, currentPage, setCurrentPage, pageSize,
  setPageSize }) => {
  const { t } = useTranslation(["user"]);
  const filtered = data.filter(u =>
    Object.values(u).some(v =>
      String(v ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <>
      <div className="table-responsive">
        <Table hover className="user-table">
          <thead>
            <tr>
              <th>{t("s_no")}</th>
              <th>{t("role")}</th>
              <th>{t("name")}</th>
              <th>{t("email")}</th>

            </tr>
          </thead>
          <tbody>
            {current.length ? (
              current.map((u, idx) => (
                <tr key={u.id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td>{u.role}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  {t("noUsersFound")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>



      {filtered.length > 0 && (
        <div className="d-flex justify-content-end align-items-center gap-3 mt-2">

          {/* Page size */}
          <div className="d-flex align-items-center gap-2 user-actions">
            <span
              className="fw-semibold"
              style={{ color: "var(--bs-heading-color)" }}
            >
              {t("page_size")}
            </span>

            <select
              className="form-select form-select-sm"
              style={{ width: "90px" }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 15, 20, 25, 30].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Pagination */}
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <li
                key={number}
                className={`page-item ${currentPage === number ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </li>
          </ul>

        </div>
      )}

    </>
  );
};

export default UserTable;
