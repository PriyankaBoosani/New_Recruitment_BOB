import React from "react";
import { Table, Button } from "react-bootstrap";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";
import { useTranslation } from "react-i18next";
import viewIcon from "../../../../../assets/view_icon.png";

const EducationTable = ({
  data,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  onEdit,
  onDelete,
  onView
}) => {

  const { t } = useTranslation(["education", "common"]);

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const current = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <>
      <div className="table-responsive">
        <Table hover className="user-table">

          <thead>
            <tr>
              <th>{t("education:s_no")}</th>
              <th>{t("education:education_level")}</th>
              <th>{t("education:course")}</th>
              <th>{t("education:specialization")}</th>
              <th style={{ textAlign: "center" }}>
                {t("common:actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {current.length ? (
              current.map((item, idx) => (
                <tr key={idx}>

                  <td>{indexOfFirst + idx + 1}</td>

                 <td>{item.educationLevel}</td>

                  <td>{item.course}</td>

                  <td>
                    {item.specialization.map((s) => s.name).join(", ")}
                  </td>

                  <td>
                    <div className="action-buttons">

                      {/* VIEW */}
                      <Button
                        variant="link"
                        className="action-btn view-btn"
                        onClick={() => onView(item, idx)}
                      >
                        <img src={viewIcon} alt="View" className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn edit-btn"
                        onClick={() => onEdit(item, idx)}
                      >
                        <img src={editIcon} alt={t("common:edit", "Edit")} className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn delete-btn"
                        onClick={() => onDelete(idx)}
                      >
                        <img src={deleteIcon} alt={t("common:delete")} className="icon-16" />
                      </Button>

                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  {t("education:no_data")}
                </td>
              </tr>
            )}
          </tbody>

        </Table>
      </div>

      {/* PAGINATION */}
      {data.length > 0 && (
        <div className="d-flex justify-content-end align-items-center gap-3 mt-2">

          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">
              {t("education:page_size")}
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
              {[5, 10, 15, 20].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &laquo;
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
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

export default EducationTable;