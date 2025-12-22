import React from "react";
import { Table, Button } from "react-bootstrap";
import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

const PositionTable = ({
  data,
  searchTerm,
  currentPage,
  setCurrentPage,
  onEdit,
  onDelete,
  t
}) => {
  const itemsPerPage = 7;

  /* ✅ FILTER (NO UUID FILTERING) */
  const filtered = !searchTerm
    ? data
    : data.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <th>{t("s_no")}</th>
              <th>{t("position_title")}</th>
              <th>{t("department")}</th>
              <th>{t("job_grade")}</th>
              <th>{t("description")}</th>
              <th style={{ textAlign: "center" }}>{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {current.length > 0 ? (
              current.map((p, idx) => (
                <tr key={p.id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td>{p.title}</td>
                  <td>{p.department}</td>
                  <td>{p.jobGrade}</td>
                  <td>{p.description}</td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="link"
                        className="action-btn"
                        title="View"
                      >
                        <img
                          src={viewIcon}
                          alt="view"
                          className="icon-16"
                        />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn"
                        title="Edit"
                        onClick={() => onEdit(p)}
                      >
                        <img
                          src={editIcon}
                          alt="edit"
                          className="icon-16"
                        />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn"
                        title="Delete"
                        onClick={() => onDelete(p)}
                      >
                        <img
                          src={deleteIcon}
                          alt="delete"
                          className="icon-16"
                        />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No positions found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <div className="pagination-container">
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default PositionTable;
