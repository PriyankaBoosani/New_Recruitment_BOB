import React from "react";
import { Table, Button } from "react-bootstrap";
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
   itemsPerPage,
  setItemsPerPage
}) => {
  const { t } = useTranslation(["genericOrAnnexures"]);
  const rows = Array.isArray(data) ? data : [];

 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRows = rows.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(rows.length / itemsPerPage);
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

        {/* DROPDOWN LEFT + PAGINATION RIGHT */}
     {rows.length > 0 && (
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

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <li
          key={page}
          className={`page-item ${currentPage === page ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(page)}
          >
            {page}
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

export default GenericOrAnnexuresTable;
