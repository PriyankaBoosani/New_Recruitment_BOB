import React from "react";

const InterviewPanelTable = () => {
  return (
    <>
      <div className="table-header">
        <h5>Panels History</h5>
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
             <button onClick={() => {
  // setFormData({
  //   name: panel.name,
  //   community: panel.communityId,
  //   members: panel.memberIds
  // });
  //setEditingId(panel.id);
}}>
  Edit
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
