import React from "react";
import "../../../style/css/RequisitionStrip.css";

const RequisitionStrip = ({ requisition, positionTitle }) => {
  if (!requisition) return null;

  return (
    <div className="requisition-strip">
      <div className="req-left">
        <div className="req-code">
          {requisition.requisition_code}
        </div>

        <div className="req-dates">
          <span>
            <i className="bi bi-calendar3"></i>{" "}
            Start: {requisition.start_date}
          </span>
          <span>
            <i className="bi bi-calendar3"></i>{" "}
            End: {requisition.end_date}
          </span>
        </div>

        <div className="req-title">
          {positionTitle}
        </div>
      </div>

      <div className="req-right">
        <button className="btn-view-position">
          View Position
        </button>
      </div>
    </div>
  );
};

export default RequisitionStrip;
