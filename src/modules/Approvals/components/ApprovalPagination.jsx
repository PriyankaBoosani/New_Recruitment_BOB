import React from "react";
import { Form } from "react-bootstrap";

export default function ApprovalPagination({
  page,
  pageSize,
  setPage,
  setPageSize,
  pageInfo,
  getVisiblePages,
}) {
  return (
    <div className="table-footer d-flex justify-content-between align-items-center flex-wrap">
      <div className="d-flex align-items-center gap-2">
        <span>Page Size:</span>

        <Form.Select
          style={{ width: 90 }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
        >
          {[5, 10, 15, 20, 25, 30].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </Form.Select>
      </div>

      <nav>
        <ul className="pagination mb-0">

          <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              &laquo;
            </button>
          </li>

          {(() => {
            const { pages } = getVisiblePages(
              page,
              pageInfo.totalPages
            );

            return pages.map((p) => (
              <li
                key={p}
                className={`page-item ${page === p ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(p)}
                >
                  {p + 1}
                </button>
              </li>
            ));
          })()}

          <li
            className={`page-item ${
              page >= pageInfo.totalPages - 1
                ? "disabled"
                : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() =>
                setPage((p) =>
                  Math.min(pageInfo.totalPages - 1, p + 1)
                )
              }
            >
              &raquo;
            </button>
          </li>

        </ul>
      </nav>
    </div>
  );
}