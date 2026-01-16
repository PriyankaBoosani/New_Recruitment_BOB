import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

const CategoryTable = ({
  data,
  searchTerm,
  currentPage,
  setCurrentPage,
  onEdit,
  onView,
  onDelete
}) => {
  const { t } = useTranslation(["category"]);
  const itemsPerPage = 7;

  const filtered = data.filter(c => {
  const term = searchTerm.toLowerCase().trim();

  if (!term) return true;

  return (
    c.code?.toLowerCase().includes(term) ||
    c.name?.toLowerCase().includes(term) ||
    c.description?.toLowerCase().includes(term)
  );
});


  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const current = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
      <div className="table-responsive">
        <Table hover className="user-table">
          <thead>
            <tr>
              <th>{t("s_no")}</th>
              <th>{t("code")}</th>
              <th>{t("name")}</th>
              <th>{t("description")}</th>
              <th style={{ textAlign: "center" }}>{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {current.length > 0 ? (
              current.map((c, idx) => (
                <tr key={c.id}>
                  <td>{indexFirst + idx + 1}</td>
                  <td>{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.description}</td>

                  {/*  ACTIONS – SAME AS DEPARTMENT */}
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="link"
                        className="action-btn view-btn"
                        title="View"
                        onClick={() => onView(c)}
                      >
                        <img src={viewIcon} alt="View" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn edit-btn"
                        title="Edit"
                        onClick={() => onEdit(c)}
                      >
                        <img src={editIcon} alt="Edit" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn delete-btn"
                        title="Delete"
                        onClick={() => onDelete(c)}
                      >
                        <img src={deleteIcon} alt="Delete" className="icon-16" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  {t("no_categories")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <div className="pagination-container">
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
                className={`page-item ${n === currentPage ? 'active' : ''}`}
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

export default CategoryTable;
