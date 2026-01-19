// src/modules/master/pages/Document/components/DocumentTable.jsx

import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

// const DocumentTable = ({
//   data,
//   searchTerm,
//   onEdit,
//   onView,
//   onDelete,
//   currentPage,
//   setCurrentPage
const DocumentTable = ({
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
  const { t } = useTranslation(["documents"]);
 

  const filtered = data.filter(d =>
    [d.name, d.description].some(v =>
      String(v || '').toLowerCase().includes(searchTerm.toLowerCase())
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
              <th>{t("document_name")}</th>
              <th>{t("description")}</th>
              <th>{t("confirm_required")}</th>
              <th style={{ textAlign: "center" }}>{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {current.length > 0 ? (
              current.map((d, idx) => (
                <tr key={d.id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td>{d.name}</td>
                  <td>{d.description}</td>
                <td>{d.isRequiredConfirmed ? "True" : "False"}</td>


                  <td>
                    <div className="action-buttons">
                    <Button
                        variant="link"
                        className="action-btn view-btn"
                        onClick={() => onView(d)}
                      >

                        <img src={viewIcon} alt="view" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn edit-btn"
                        onClick={() => onEdit(d)}
                      >
                        <img src={editIcon} alt="edit" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn delete-btn"
                        onClick={() => onDelete(d)}
                      >
                        <img src={deleteIcon} alt="delete" className="icon-16" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  {t("noRecords")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

    

         {/* DROPDOWN LEFT + PAGINATION RIGHT */}
      {filtered.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-2">

          {/* LEFT: rows per page */}
          <div>
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

          {/* RIGHT: pagination */}
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <li
                key={n}
                className={`page-item ${currentPage === n ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(n)}
                >
                  {n}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
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

export default DocumentTable;
