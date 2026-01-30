const SelectPositionBar = ({ context, setContext, onAssign }) => {
  return (
    <div className="select-bar card">
      <div className="row">
        <div className="field">
          <label>Requisition</label>
          <select
            value={context.requisitionId}
            onChange={(e) =>
              setContext({ ...context, requisitionId: e.target.value })
            }
          >
            <option value="">Select Requisition</option>
            <option value="1">BOB/HRM/REC/ADVT/2025/06</option>
          </select>
        </div>

        <div className="field">
          <label>Position</label>
          <select
            value={context.positionId}
            onChange={(e) =>
              setContext({ ...context, positionId: e.target.value })
            }
          >
            <option value="">Select Position</option>
            <option value="1">
              Product - ONDC (Open Network for Digital Commerce)
            </option>
          </select>
        </div>

        <div className="actions">
          <button
            className="btn-primary"
            disabled={!context.requisitionId || !context.positionId}
            onClick={onAssign}
          >
            + Assign Committees
          </button>

          <button className="btn-secondary">
            Import Committees
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPositionBar;
