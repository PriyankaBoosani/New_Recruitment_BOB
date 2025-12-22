// src/modules/master/pages/InterviewPanel/components/InterviewPanelTable.jsx

import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

const InterviewPanelTable = ({
  data,
  searchTerm,
  onEdit,
  onDelete,
  currentPage,
  setCurrentPage
}) => {
  const { t } = useTranslation(["interviewPanel"]);
  const itemsPerPage = 7;

  const filtered = data.filter(p =>
    [p.name, p.members].some(v =>
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
              <th>{t("panel_name")}</th>
              <th>{t("panel_members")}</th>
              <th style={{ textAlign: "center" }}>{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {current.length > 0 ? (
              current.map((p, idx) => (
                <tr key={p.id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.members}</td>
                  <td>
                    <div className="action-buttons">
                      <Button variant="link" className="action-btn view-btn">
                        <img src={viewIcon} alt="view" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn edit-btn"
                        onClick={() => onEdit(p)}
                      >
                        <img src={editIcon} alt="edit" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn delete-btn"
                        onClick={() => onDelete(p)}
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
                  {t("no_records")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <div className="pagination-container">
          <nav>
            <ul className="pagination">
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
          </nav>
        </div>
      )}
    </>
  );
};

export default InterviewPanelTable;
