import React from "react";
import edit_icon from "../../../assets/edit_icon.png";
import delete_icon from "../../../assets/delete_icon.png";

const InterviewPanelTable = ({
  panels,
  onEdit,
  onDelete,
  page,
  setPage,
  totalPages,
  pageSize = 10,
  search,
  setSearch,
  showFilters,
  setShowFilters
}) => {
  return (
    <>
      {/* ===== HEADER ===== */}
      <div className="table-header">
        <span className="table-title">Panels History</span>



        

        <div className="table-search-row">
          <input
            type="text"
            placeholder="Search by panel name..."
            className="table-search-input"
            value={search?.panelName || ""}
            onChange={(e) =>
              setSearch(prev => ({
                ...prev,
                panelName: e.target.value
              }))
            }
          />

          <button
            className="filter-btn"
            onClick={() => setShowFilters(prev => !prev)}
          >
            <span className="filter-icon">⏷</span>
            Filters
          </button>
        </div>
      </div>

      

      {/* ===== TABLE ===== */}
      <table className="table panel-table">
        <thead>
          <tr>
            <th>S. No.</th>
            <th>Panel Name</th>
            <th>Panel Type</th>
            <th>Panel Members</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {panels.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No panels found
              </td>
            </tr>
          ) : (
            panels.map((panel, index) => (
              <tr key={panel.id}>
                {/* ✅ Correct serial number */}
                <td>{page * pageSize + index + 1}</td>

                <td>{panel.panelName}</td>
                <td>{panel.panelType}</td>
                <td>{panel.members}</td>

                <td className="actions">
                  <div className="icon-group">
                    <button
                      className="table-icon-btn edit"
                      onClick={() => onEdit(panel.id)}
                    >
                      <img src={edit_icon} alt="Edit" />
                    </button>

                    <button
                      className="table-icon-btn delete"
                      onClick={() => onDelete(panel.id)}
                    >
                      <img src={delete_icon} alt="Delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ===== PAGINATION (MATCHES SCREENSHOT) ===== */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* Previous */}
          <button
            className="pagination-btn"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            ‹
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`pagination-btn ${page === i ? "active" : ""}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            className="pagination-btn"
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
};

export default InterviewPanelTable;
