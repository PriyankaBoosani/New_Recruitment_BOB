import React, { useState } from "react";
import SelectPositionBar from "./components/SelectPositionBar";
import ConfigureCommittees from "./components/ConfigureCommittees";
import "../../style/css/Committee.css";

const AssignPositionsPage = () => {
  const [showConfig, setShowConfig] = useState(false);

  const [context, setContext] = useState({
    requisitionId: "",
    positionId: ""
  });

  return (
    <div className="assign-page">
      <SelectPositionBar
        context={context}
        setContext={setContext}
        onAssign={() => setShowConfig(true)}
      />

      {showConfig && (
        <ConfigureCommittees
          context={context}
          onCancel={() => setShowConfig(false)}
        />
      )}
    </div>
  );
};

export default AssignPositionsPage;
