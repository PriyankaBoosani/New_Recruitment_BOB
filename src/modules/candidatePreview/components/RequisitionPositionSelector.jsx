import React, { useEffect, useState } from "react";
import Select from "react-select";

import {
  mapUniqueRequisitionsToDropdown,
  mapUniquePositionsToDropdown
} from "../../Verification/mappers/CandidateVerificationMapper";

/* ===== IMPORT SAME DUMMY DATA ===== */
// import { DUMMY_DATA } from "../../Verification/components/mockData";

const RequisitionPositionSelector = ({
  apiList = [],
  onRequisitionChange,
  onPositionChange,
}) => {

  const [requisitions, setRequisitions] = useState([]);
  const [positions, setPositions] = useState([]);

  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);


  useEffect(() => {
  console.log("Selector apiList:", apiList.length);
}, [apiList]);


 useEffect(() => {
  setRequisitions(
    mapUniqueRequisitionsToDropdown(apiList)
  );
}, [apiList]);


  useEffect(() => {
    setSelectedPosition(null);
    setPositions([]);

    if (!selectedRequisition) return;

   setPositions(
  mapUniquePositionsToDropdown(
    apiList,
    selectedRequisition.value
  )
);

}, [selectedRequisition, apiList]);

  return (
    <div className="row g-3">

      <div className="col-md-6">
        <label>Requisition</label>
        <Select
          isClearable
          options={requisitions}
          value={selectedRequisition}
          onChange={(opt) => {
            setSelectedRequisition(opt);
            onRequisitionChange?.(opt?.raw || null);
            setSelectedPosition(null);
            onPositionChange?.(null);
          }}
        />
      </div>

      <div className="col-md-6">
        <label>Position</label>
        <Select
          isClearable
          options={positions}
          value={selectedPosition}
          isDisabled={!selectedRequisition}
          onChange={(opt) => {
            setSelectedPosition(opt);
            onPositionChange?.(opt?.raw || null);
          }}
        />
      </div>

    </div>
  );
};

export default RequisitionPositionSelector;
