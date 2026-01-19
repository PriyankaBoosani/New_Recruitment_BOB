import React from "react";
import { Table, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import viewIcon from "../../../../../assets/view_icon.png";
import downloadIcon from "../../../../../assets/downloadIcon.png";

const GenericOrAnnexuresTable = ({
  data = [],
  onView,
  onDownload,
  onDelete,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize
}) => {

  const { t } = useTranslation(["genericOrAnnexures"]);
  const rows = Array.isArray(data) ? data : [];

const indexOfLastItem = currentPage * pageSize;
const indexOfFirstItem = indexOfLastItem - pageSize;
const currentRows = rows.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(rows.length / pageSize);

 
  const paginate = (page) => setCurrentPage(page);

  return (
    <>
      <div className="table-responsive">
        <Table hover className="user-table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>{t("s_no")}</th>
              <th>{t("type")}</th>
              <th>{t("file")}</th>
              <th>{t("version")}</th>
              <th style={{ width: "140px", textAlign: "center" }}>
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((item, idx) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + idx + 1}</td>
                  <td>{item?.type || "-"}</td>
                  <td>{item?.fileName || "-"}</td>
                  <td>{item?.version || "-"}</td>

                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="link"
                        className="action-btn view-btn"
                        onClick={() => onView(item)}
                      >
                        <img src={viewIcon} alt={t("view")} className="icon-16" />
                      </Button>

                      <Button
                        variant="link"
                        className="action-btn edit-btn"
                        onClick={() => onDownload(item)}
                      >
                        <img src={downloadIcon} alt={t("download")} className="icon-16" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  {t("no_records")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>


      {/* ===== PAGINATION ===== */}
{rows.length > pageSize && (







      <div className="d-flex justify-content-between align-items-center mt-2">
  
    {/* <span className="me-2">Rows per page:</span> */}
    <Form.Select
      size="sm"
      style={{ width: "90px" }}
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
      <option value={20}>20</option>
      <option value={25}>25</option>
      <option value={30}>30</option>
    </Form.Select>

        <div className="pagination-container">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => paginate(page)}>
                  {page}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </div>
           </div>
      )}
    </>
  );
};

export default GenericOrAnnexuresTable;
