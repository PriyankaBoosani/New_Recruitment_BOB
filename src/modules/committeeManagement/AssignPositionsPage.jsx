import React from "react";
import { useAssignPositions } from "./hooks/useAssignPositions";
import SelectionSection from "./components/SelectionSection";
import CommitteeConfigSection from "./components/CommitteeConfigSection";
import RequisitionStrip from "../candidatePreview/components/RequisitionStrip";

const AssignPositionsPage = () => {

  const assignHook = useAssignPositions();

  const {
    selectedRequisition,
    selectedPosition
  } = assignHook;

  return (
    <div className="assign-positions-page">

      <SelectionSection {...assignHook} />

      {selectedRequisition && selectedPosition && (
        <div className="requisition-strip-section">
          <RequisitionStrip
            requisition={selectedRequisition}
            position={selectedPosition}
            isCardBg={false}
            isSaveEnabled={false}
          />
        </div>
      )}

      <CommitteeConfigSection {...assignHook} />

    </div>
  );
};

export default AssignPositionsPage;
