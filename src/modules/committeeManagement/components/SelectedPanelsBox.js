import React from "react";

const SelectedPanelsBox = ({
  panels,
  activeTab,
  toggleCommittee,
  updateCommitteeDate,
  panelErrors
}) => {

  return (
    <div className="panel-box selected">
      <div className="panel-header">
        <h3 className="panel-title">Selected Panels</h3>
        <span className="panel-count">{panels.length}</span>
      </div>

      <div className="panel-divider"></div>

      <div className="panel-content">
        {panels.length > 0 ? (
          panels.map(committee => {

            const errorKey = `${activeTab}_${committee.id}`;
            const errors = panelErrors?.[errorKey] || {};

            return (
              <div className="committee-row selected" key={committee.id}>
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

                  <div className="date-row">
                    <div>
                      <label>START DATE</label>
                      <input
                        type="date"
                        value={committee.startDate}
                        onChange={(e) =>
                          updateCommitteeDate(
                            activeTab,
                            committee.id,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                      {errors.startDate && (
                        <div className="field-error">
                          {errors.startDate}
                        </div>
                      )}
                    </div>

                    <div>
                      <label>END DATE</label>
                      <input
                        type="date"
                        value={committee.endDate}
                        onChange={(e) =>
                          updateCommitteeDate(
                            activeTab,
                            committee.id,
                            "endDate",
                            e.target.value
                          )
                        }
                      />
                      {errors.endDate && (
                        <div className="field-error">
                          {errors.endDate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  className="action-pill remove"
                  onClick={() => toggleCommittee(activeTab, committee)}
                >
                  ← Remove
                </button>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-text">
              No panels selected
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedPanelsBox;
