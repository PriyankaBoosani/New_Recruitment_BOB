import React, { useMemo } from "react";
import Select from "react-select";

export default function InterviewerPositionSelector({
  apiData = [],
  selectedRequisition,
  selectedPosition,
  onRequisitionChange,
  onPositionChange
}) {

  /* ===== requisition options ===== */

const requisitionOptions = useMemo(() => {
  const map = new Map();

  apiData.forEach(r => {
    const req = r?.requisition;
    if (!req?.id) return;

    if (!map.has(req.id)) {
      map.set(req.id, {
        value: req.id,
        label: `${req.requisitionCode} — ${req.requisitionTitle}`,
        raw: r
      });
    }
  });

  return Array.from(map.values());
}, [apiData]);



  /* ===== position options ===== */

const positionOptions = useMemo(() => {
  if (!selectedRequisition) return [];

  return apiData
    .filter(r => r.requisition.id === selectedRequisition.requisition.id)
   .map(r => ({
  value: r.position.positionId,
  label: r.masterPosition.positionName,
  raw: r,
  requisitionId: r.requisition.id
}));


}, [apiData, selectedRequisition]);
console.log("SELECTOR apiData:", apiData);
console.log("requisitionOptions:", requisitionOptions);


  return (
    <div className="row g-3">

    <div className="col-md-3 col-12">

   <label className="fs-14 blue-color">Requisition</label>


        <Select
          className="mt-1 fs-14"
  classNamePrefix="react-select"
          options={requisitionOptions}
value={
  selectedRequisition
    ? {
        value: selectedRequisition.requisition.id,
        label: `${selectedRequisition.requisition.requisitionCode} — ${selectedRequisition.requisition.requisitionTitle}`,
        raw: selectedRequisition
      }
    : null
}

          isClearable
          placeholder="Select Requisition"
       onChange={(opt) => {
onRequisitionChange(opt?.raw || null);
  onPositionChange(null);
}}

        />
      </div>

    <div className="col-md-3 col-12">
      <label className="fs-14 blue-color">Position</label>
        <Select
        className="mt-1 fs-14"
  classNamePrefix="react-select"
          options={positionOptions}
value={
  selectedPosition
    ? {
        value: selectedPosition.position.positionId,
        label: selectedPosition.masterPosition.positionName,
        raw: selectedPosition
      }
    : null
}


          isClearable
          isDisabled={!selectedRequisition}
          placeholder="Select Position"
          onChange={(opt) => {
            onPositionChange(opt?.raw || null);
          }}
        />
      </div>

    </div>
  );
}
