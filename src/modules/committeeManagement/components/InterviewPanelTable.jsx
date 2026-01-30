import React from "react";
import edit_icon from "../../../assets/edit_icon.png"
import delete_icon from "../../../assets/delete_icon.png"
const InterviewPanelTable = ( { panels, onEdit, onDelete }) => {
  console.log("panels", panels);
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
           {panels.map((panel, index) => (
            <tr key={panel.id}>
              <td>{index + 1}</td>
              <td>{panel.panelName}</td>
              <td>{panel.panelType}</td>
              <td>{panel.members}</td>
              <td className="actions">
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
              </td>
            </tr>
          ))}
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
