import React from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const UserTable = ({ data, searchTerm, currentPage, setCurrentPage }) => {
  const { t } = useTranslation(["user"]);
  const itemsPerPage = 7;

  const filtered = data.filter(u =>
    Object.values(u).some(v =>
      String(v ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
      <div className="table-responsive">
        <Table hover className="user-table">
          <thead>
            <tr>
              <th>{t("sno")}</th>
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

      {totalPages > 1 && (
        <div className="pagination-container">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button onClick={() => setCurrentPage(currentPage - 1)} className="page-link">&laquo;</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <li key={n} className={`page-item ${n === currentPage ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(n)}>{n}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button onClick={() => setCurrentPage(currentPage + 1)} className="page-link">&raquo;</button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default UserTable;
