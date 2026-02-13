import React, { useMemo } from "react";
import Select from "react-select";

import {
  mapUniqueRequisitionsToDropdown,
  mapUniquePositionsToDropdown
} from "../../Verification/mappers/CandidateVerificationMapper";

const RequisitionPositionSelector = ({
  apiList = [],
  onRequisitionChange,
  onPositionChange,
  selectedRequisitionRaw,
  selectedPositionRaw
}) => {

  /* ===== Build requisition options ===== */

  const requisitions = useMemo(
    () => mapUniqueRequisitionsToDropdown(apiList),
    [apiList]
  );

  /* ===== derive selected requisition option from parent ===== */

  const selectedRequisitionOption = useMemo(() => {
    if (!selectedRequisitionRaw) return null;

    return requisitions.find(
      r => r.value === selectedRequisitionRaw.requisition_id
    ) || null;

  }, [requisitions, selectedRequisitionRaw]);

  /* ===== Build positions based on selected requisition ===== */

  const positions = useMemo(() => {
    if (!selectedRequisitionOption) return [];

    return mapUniquePositionsToDropdown(
      apiList,
      selectedRequisitionOption.value
    );

  }, [apiList, selectedRequisitionOption]);

  /* ===== derive selected position option from parent ===== */

  const selectedPositionOption = useMemo(() => {
    if (!selectedPositionRaw) return null;

    return positions.find(
      p => p.value === selectedPositionRaw.positionId
    ) || null;

  }, [positions, selectedPositionRaw]);

  /* ===== UI ===== */

  return (
    <div className="row g-3">

<div className="col-md-4">
  <label className="fs-14 blue-color">Requisition</label>
  <Select
    className="mt-1 fs-14"
    classNamePrefix="react-select"

          isClearable
          placeholder="Select Requisition"
          options={requisitions}
          value={selectedRequisitionOption}
          onChange={(opt) => {
            onRequisitionChange?.(opt?.raw || null);
            onPositionChange?.(null);
          }}
        />
      </div>

<div className="col-md-4">
  <label className="fs-14 blue-color">Position</label>
  <Select
    className="mt-1 fs-14"
    classNamePrefix="react-select"

          isClearable
            placeholder="Select Position"
          options={positions}
          value={selectedPositionOption}
          isDisabled={!selectedRequisitionOption}
          onChange={(opt) => {
            onPositionChange?.(opt?.raw || null);
          }}
        />
      </div>

    </div>
  );
};

export default RequisitionPositionSelector;
