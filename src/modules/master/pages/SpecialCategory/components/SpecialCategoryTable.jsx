// src/modules/master/pages/SpecialCategory/components/SpecialCategoryTable.jsx

import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

const SpecialCategoryTable = ({
  data,
  searchTerm,
  onView,
  onEdit,
  onDelete,
  currentPage,
  setCurrentPage
}) => {
  const { t } = useTranslation(["specialCategory"]);
  const itemsPerPage = 7;

const filtered = data.filter(s =>
  Object.values(s).some(v =>
    String(v ?? '').toLowerCase().includes(searchTerm.toLowerCase())
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
              <th>{t("code")}</th>
              <th>{t("name")}</th>
              <th>{t("description")}</th>
              <th style={{ textAlign: "center" }}>{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {current.length > 0 ? (
              current.map((s, idx) => (
                <tr key={s.id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td>{s.code}</td>
                  <td>{s.name}</td>
                  <td>{s.description}</td>
                  <td>
                    <div className="action-buttons">
                     <Button
                        variant="link"
                        className="action-btn view-btn"
                        onClick={() => onView(s)}
                      >
                        <img src={viewIcon} alt="view" className="icon-16" />
                      </Button>


                      <Button
                        variant="link"
                        className="action-btn edit-btn"
                        onClick={() => onEdit(s)}
                      >
                        <img src={editIcon} alt="edit" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn delete-btn"
                        onClick={() => onDelete(s)}
                      >
                        <img src={deleteIcon} alt="delete" className="icon-16" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  {t("noRecords")}
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

export default SpecialCategoryTable;
