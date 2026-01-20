import React from "react";
import { Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

const CertificationTable = ({
  data,
  searchTerm,
  onEdit,
  onView,
  onDelete,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage
}) => {
  const { t } = useTranslation(["certification"]);


  /* ---------- FILTER ---------- */
  const filteredCerts = data.filter(cert => {
  const term = (searchTerm || "").toLowerCase().trim();
  if (!term) return true;

  return (
    cert.name?.toLowerCase().includes(term) ||
    cert.description?.toLowerCase().includes(term)
  );
});



  /* ---------- PAGINATION ---------- */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCerts = filteredCerts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCerts.length / itemsPerPage);

  const paginate = (num) => setCurrentPage(num);

  return (
    <>
      <div className="table-responsive">
        <Table hover className="user-table">
          <thead>
            <tr>
              <th>{t("s_no")}</th>
                <th>{t("name")}</th>  
                <th>{t("description")}</th>
              <th style={{ textAlign: "center" }}>{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {currentCerts.length > 0 ? (
              currentCerts.map((cert, idx) => (
                <tr key={cert.id}>
                  <td>{indexOfFirst + idx + 1}</td>

                  <td data-label="Name:">
                    &nbsp;{cert.name}
                  </td>

                  <td data-label="Description:">
                    &nbsp;{cert.description}
                  </td>

                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="link"
                        className="action-btn view-btn"
                        title="View"
                        onClick={() => onView(cert)}
                      >
                        <img src={viewIcon} alt="View" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn edit-btn"
                        title="Edit"
                        onClick={() => onEdit(cert)}
                      >
                        <img src={editIcon} alt="Edit" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn delete-btn"
                        title="Delete"
                        onClick={() => onDelete(cert)}
                      >
                        <img src={deleteIcon} alt="Delete" className="icon-16" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  {t("no_records")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* DROPDOWN LEFT + PAGINATION RIGHT */}
     {filteredCerts.length > 0 && (
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
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
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
          className={`page-item ${
            currentPage === number ? "active" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        </li>
      ))}

      <li
        className={`page-item ${
          currentPage === totalPages ? "disabled" : ""
        }`}
      >
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

export default CertificationTable;
