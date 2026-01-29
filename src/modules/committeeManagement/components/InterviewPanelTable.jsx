import React from "react";
import edit_icon from "../../../assets/edit_icon.png"
import delete_icon from "../../../assets/delete_icon.png"
const InterviewPanelTable = () => {
  return (
    <>
      <div className="table-header">
        <span className="table-title">Panels History</span>
        {/* <button className="filter-btn">Filters</button> */}
      </div>

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
          <tr>
            <td>1</td>
            <td>Interview Panel 1</td>
            <td>Interview</td>
            <td>Barat T, Naresh P, Jagadeesh S</td>
            <td className="actions">
                <button
                  className="table-icon-btn edit"
                  title="Edit Panel"
                  onClick={() => {
                    // TODO: hook edit logic later
                  }}
                >
                  <img src={edit_icon} alt="Edit" />
                </button>

                <button
                  className="table-icon-btn delete"
                  title="Delete Panel"
                  onClick={() => {
                    // TODO: hook delete logic later
                  }}
                >
                  <img src={delete_icon} alt="Delete" />
                </button>
              </td>
          </tr>
        </tbody>
      </table>

      {/* Pagination */}
      {/* <div className="pagination">
        <button>{"<"}</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>{">"}</button>
      </div> */}
    </>
  );
};

export default InterviewPanelTable;
