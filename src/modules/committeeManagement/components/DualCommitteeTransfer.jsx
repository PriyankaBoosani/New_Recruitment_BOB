import React, { useState } from "react";

const MOCK_PANELS = [
  { id: 1, name: "Screening Panel 1", members: ["Vijay V", "Satish J"] },
  { id: 2, name: "Screening Panel 2", members: ["Naresh P", "Veeresh V"] },
  { id: 3, name: "Screening Panel 3", members: ["Bharat T", "Sathvik P"] }
];

const DualCommitteeTransfer = () => {
  const [available, setAvailable] = useState(MOCK_PANELS);
  const [selected, setSelected] = useState([]);

  const addPanel = (panel) => {
    setAvailable(prev => prev.filter(p => p.id !== panel.id));
    setSelected(prev => [
      ...prev,
      { ...panel, startDate: "", endDate: "" }
    ]);
  };

  const removePanel = (panel) => {
    setSelected(prev => prev.filter(p => p.id !== panel.id));
    setAvailable(prev => [...prev, panel]);
  };

  return (
    <div className="dual-box">
      {/* LEFT */}
      <div className="box left">
        <h6>Available Panels ({available.length})</h6>

        {available.map(p => (
          <div key={p.id} className="panel-card">
            <div>
              <strong>{p.name}</strong>
              <div className="chips">
                {p.members.map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
            <button onClick={() => addPanel(p)}>Add →</button>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="box right">
        <h6>Selected Panels ({selected.length})</h6>

        {selected.map(p => (
          <div key={p.id} className="panel-card selected">
            <div>
              <strong>{p.name}</strong>
              <div className="chips">
                {p.members.map(m => <span key={m}>{m}</span>)}
              </div>

              <div className="dates">
                <input type="date" />
                <input type="date" />
              </div>
            </div>

            <button onClick={() => removePanel(p)}>← Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DualCommitteeTransfer;
