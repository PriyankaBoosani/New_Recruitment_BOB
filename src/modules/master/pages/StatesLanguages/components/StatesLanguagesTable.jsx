import React from "react";
import { Table, Button } from "react-bootstrap";

import editIcon from "../../../../../assets/edit_icon.png";
import viewIcon from "../../../../../assets/view_icon.png";

const StatesLanguagesTable = ({
  data = [],
  onEdit,
  onView
}) => {

  return (
    <div className="table-responsive">
      <Table hover className="user-table">

        <thead>
          <tr>
            <th>S.No</th>
            <th>State</th>
            <th>Languages</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length ? (
            data.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>

                {/* ✅ DIRECT VALUES */}
                <td>{item.stateName || "-"}</td>

                <td>
                  {item.languageNames?.length
                    ? item.languageNames.join(", ")
                    : "-"}
                </td>

                <td>
                  <div className="action-buttons">

                    <Button variant="link" onClick={() => onView(item)}>
                      <img src={viewIcon} alt="View" className="icon-16" />
                    </Button>

                    <Button variant="link" onClick={() => onEdit(item, idx)}>
                      <img src={editIcon} alt="Edit" className="icon-16" />
                    </Button>

                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No Data
              </td>
            </tr>
          )}
        </tbody>

      </Table>
    </div>
  );
};

export default StatesLanguagesTable;