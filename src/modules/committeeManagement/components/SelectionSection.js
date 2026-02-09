import React from "react";

const SelectionSection = ({
  requisitions,
  positions,
  selectedRequisition,
  selectedPosition,
  handleRequisitionChange,
  setSelectedPosition
}) => {

  return (
    <div className="selection-section">
      <div className="mb-3">
        <div className="assign-position-title">Select Position</div>
        <div className="assign-position-muted">
          Choose a requisition and position to assign committees to.
        </div>
      </div>

      <div className="selection-grid">
        <div className="form-group">
          <label className="form-label">Requisition</label>
          <select
            className="form-select"
            value={selectedRequisition}
            onChange={handleRequisitionChange}
          >
            <option value="">Select Requisition</option>
            {requisitions.map(req => (
              <option key={req.id} value={req.id}>
                {req.requisitionCode}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Position</label>
          <select
            className="form-select"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            disabled={!selectedRequisition}
          >
            <option value="">Select Position</option>
            {positions.map(pos => (
              <option
                key={pos.jobPositions?.positionId}
                value={pos.jobPositions?.positionId}
              >
                {pos.masterPositions?.positionName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SelectionSection;
