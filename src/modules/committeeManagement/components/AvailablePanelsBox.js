import React from "react";

const AvailablePanelsBox = ({
  panels,
  activeTab,
  toggleCommittee
}) => {

  return (
    <div className="panel-box available">
      <div className="panel-header">
        <h3 className="panel-title">Available Panels</h3>
        <span className="panel-count">{panels.length}</span>
      </div>

      <div className="panel-divider"></div>

      <div className="panel-content">
        {panels.map(committee => (
          <div className="committee-row" key={committee.id}>
            <div>
              <div className="committee-title">
                {committee.name}
              </div>

              <div className="committee-chips">
                {committee.members.map(m => (
                  <span key={m.name} className="chip">
                    {m.name}
                  </span>
                ))}
              </div>
            </div>

            <button
              className="action-pill add"
              onClick={() => toggleCommittee(activeTab, committee)}
            >
              Add →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailablePanelsBox;
