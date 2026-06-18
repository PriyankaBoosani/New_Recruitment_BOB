import React, { useMemo, useState } from "react";
import {
  Card,
  Table,
  Form,
  InputGroup,
  Pagination,
  Button,
} from "react-bootstrap";
import { FiSearch, FiGrid , FiDownload,} from "react-icons/fi";


import "../../../style/css/Dashboard/RecruiterPerformanceTable.css";
import useDashboardDownload from "../hooks/useDashboardDownload";

const ROWS_PER_PAGE = 10;

const RecruiterPerformanceTable = ({ recruiterPerformance = [], filters= {} }) => {
  const { downloadReport, downloading } = useDashboardDownload();

  const REPORT_SCREEN = "RECRUITER_PERFORMANCE_TABLE";
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // First pages
    if (currentPage <= 2) {
      return [1, 2, 3, "...", totalPages];
    }

    // Last pages
    if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // Middle pages
    return ["...", currentPage - 1, currentPage, currentPage + 1, "..."];
  };

  const filteredData = useMemo(() => {
    return recruiterPerformance.filter(
      (item) =>
        item.requisition?.toLowerCase().includes(search.toLowerCase()) ||
        item.position?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, recruiterPerformance]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Pending":
        return "status-pending";
      case "Completed":
        return "status-completed";
      default:
        return "";
    }
  };

  return (
    <Card className="recruiter-card mb-4">
      <Card.Body>
        <div className="recruiter-header">
          <div className="header-left">
            <div className="header-icon">
              <FiGrid />
            </div>

            <div>
              <h4>Recruiter Performance Table</h4>
              <p>Detailed requisition-wise recruitment metrics</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="search-container">
              <FiSearch className="search-icon" />

              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="d-flex align-items-center gap-3">
              <button
                className="pdf-btn btn btn-primary"
                disabled={downloading}
                onClick={() =>
                  downloadReport({
                    filters,
                    extension: ".pdf",
                    reportScreen: REPORT_SCREEN,
                    fileName: "recuirter-performance",
                  })
                }
              >
                <FiDownload />
                <span className="ms-2">
                  {downloading ? "Downloading..." : "Export Pdf"}
                </span>
              </button>

              <button
                className="excel-btn btn btn-primary"
                disabled={downloading}
                onClick={() =>
                  downloadReport({
                    filters,
                    extension: ".xlsx",
                    reportScreen: REPORT_SCREEN,
                    fileName: "recuirter-performance",
                  })
                }
              >
                <FiDownload />
                <span className="ms-2">
                  {downloading ? "Downloading..." : "Export Excel"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <Table className="recruiter-table">
            <thead>
              <tr>
                <th>Requisition</th>
                <th>Position</th>
                <th>Vacancy</th>
                <th>Applied</th>
                <th>Shortlisted</th>
                <th>Interview</th>
                <th>Qualified</th>
                <th>Offer Sent</th>
                <th>Offer Accepted</th>
                <th>Joined</th>
                <th>Extension</th>
                <th>Cancelled</th>
                <th>Offer Rejected</th>
                <th>Waitlist</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index}>
                  <td className="req-cell">{row.requisition}</td>

                  <td>{row.position}</td>
                  <td>{row.vacancy}</td>

                  <td>
                    <div className="applied-cell">
                      {row.applied}
                      <div className="mini-progress">
                        <div
                          style={{
                            width: `${Math.min(row.applied / 6, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td>{row.shortlisted}</td>
                  <td>{row.interview}</td>
                  <td>{row.qualified}</td>

                  <td className="offer-sent">{row.offerSent}</td>

                  <td className="accepted">{row.offerAccepted}</td>

                  <td className="joined">{row.joined}</td>

                  <td className="extension">{row.extension}</td>

                  <td className="cancelled">{row.cancelled}</td>

                  <td className="rejected">{row.rejected}</td>

                  <td className="waitlist">{row.waitlist}</td>

                  <td>
                    <span className={`${getStatusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="pagination-wrapper">
          <span>
            Showing {paginatedData.length} of {filteredData.length} requisitions
          </span>

          <Pagination className="custom-pagination">
            <Pagination.Prev
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            />

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <Pagination.Ellipsis key={`ellipsis-${index}`} />
              ) : (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Pagination.Item>
              )
            )}

            <Pagination.Next
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
            />
          </Pagination>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecruiterPerformanceTable;
