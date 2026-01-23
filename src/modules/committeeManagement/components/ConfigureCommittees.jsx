import React, { useState } from "react";
import CommitteeTabs from "./CommitteeTabs";
import DualCommitteeTransfer from "./DualCommitteeTransfer";

const ConfigureCommittees = ({ context, onCancel }) => {
  const [activeTab, setActiveTab] = useState("SCREENING");

  return (
    <div className="card configure-box">
      <div className="header">
        <div>
          <h6>Configure Committees</h6>
          <p>Assign panels to selected position</p>
        </div>

        <div className="actions">
          <button className="btn-light" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary">
            Save Configuration
          </button>
        </div>
      </div>

      <CommitteeTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <DualCommitteeTransfer committeeType={activeTab} />
    </div>
  );
};

export default ConfigureCommittees;
