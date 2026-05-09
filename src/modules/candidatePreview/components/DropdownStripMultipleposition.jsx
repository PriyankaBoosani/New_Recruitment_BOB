import React, { useMemo } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { components } from "react-select";
import "../../../style/css/CandidateScreening.css";

export default function DropdownStripMultipleposition({
  requisitions,
  positions,
  selectedRequisitionId,
  selectedPositionId,
  loadingRequisitions,
  loadingPositions,
  onRequisitionChange,
  onPositionChange,
	onRequisitionSearch,
   //  DISABLE HERE
  disableRequisition=false,
  disablePosition=false
}) {
  const { t } = useTranslation(["candidateWorkflow", "common"]);
	const requisitionOptions = useMemo(
    () =>
      requisitions.map((req) => ({
        value: req.id,
        label: `${req.requisitionCode} - ${req.requisitionTitle}`,
      })),
    [requisitions]
  );

  const positionOptions = useMemo(
    () =>
      positions.map((pos) => ({
        value: pos.jobPositions.positionId,
        label: pos?.masterPositions?.positionName,
      })),
    [positions]
  );



  const CustomValueContainer = ({ children, ...props }) => {
  const selected = props.getValue();

  if (!selected || selected.length === 0) {
    return (
      <components.ValueContainer {...props}>
        {children}
      </components.ValueContainer>
    );
  }

  const firstItem = selected[0];
  const extraCount = selected.length - 1;

  return (
    <components.ValueContainer {...props}>
      {/* <div
        title={selected.map((s) => s.label).join(", ")}
        // style={{
        //   display: "flex",
        //   alignItems: "center",
        //   gap: "6px",
        //   flexWrap: "nowrap",
        //   overflow: "hidden",
        // }}


   styles={{
  control: (base) => ({
    ...base,
    overflow: "visible",
  }),
  valueContainer: (base) => ({
    ...base,
    overflow: "visible",
  }),
}}
menuPortalTarget={document.body}
      > */}


    <div
  className="position-tooltip-wrapper"
  data-tooltip={selected.map((s) => s.label).join(", ")}
 style={{
  display: "flex",
  alignItems: "center",
  gap: "6px",
  position: "relative",

  width: "100%",
  overflow: "hidden",
}}
>
        <div
       style={{
  background: "#e2e2e2",
  border: "1px solid #cfcfcf",
  borderRadius: "2px",
  padding: "2px 8px",
  fontSize: "12px",

  maxWidth: "220px",

  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",

  display: "inline-block",
}}
        >
          {firstItem.label}
        </div>

        {extraCount > 0 && (
          <div
            style={{
              fontSize: "12px",
              color: "#555",
              fontWeight: 500,
            }}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </components.ValueContainer>
  );
};

  return (
    <>
      <div className="col-md-3 col-12">
        <label className="fs-14 blue-color">{t("candidateWorkflow:requisition")}</label>
        <Select
					className="mt-1 fs-14"
					classNamePrefix="react-select"
					options={requisitionOptions}
					isLoading={loadingRequisitions}
					placeholder={t("candidateWorkflow:select_requisition")}
          isDisabled={disableRequisition}  
					value={requisitionOptions.find(
						(opt) => opt.value === selectedRequisitionId
					)}
					onInputChange={(inputValue, actionMeta) => {
						if (actionMeta.action === "input-change") {
							onRequisitionSearch(inputValue);
						}
					}}
					onChange={(option) =>
						onRequisitionChange({
							target: { value: option ? option.value : "" },
						})
					}
				/>
      </div>

      <div className="col-md-3 col-12">
        <label className="fs-14 blue-color">{t("common:position")}</label>
        <Select
         isMulti
          className="mt-1 fs-14"
          classNamePrefix="react-select"
          options={positionOptions}
          isLoading={loadingPositions}
          isDisabled={!selectedRequisitionId || disablePosition}
          components={{
  ValueContainer: CustomValueContainer,
  MultiValue: () => null
}}
styles={{
  control: (base) => ({
    ...base,
    minHeight: "38px",
    height: "38px",
    overflow: "hidden",

    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
  }),

  valueContainer: (base) => ({
    ...base,
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",

    overflow: "hidden",

    whiteSpace: "nowrap",

    maxWidth: "calc(100% - 55px)",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "38px",

    display: "flex",
    alignItems: "center",

    flexShrink: 0,
  }),

  clearIndicator: (base) => ({
    ...base,
    padding: "0 4px",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 4px",
  }),

  indicatorSeparator: (base) => ({
    ...base,
    marginTop: "6px",
    marginBottom: "6px",
  }),
}}
          
          placeholder={
            loadingPositions ? t("candidateWorkflow:loading_positions") : t("candidateWorkflow:select_position")
          }
         value={positionOptions.filter(opt =>
  selectedPositionId?.includes(opt.value)
)}
          onChange={(options) =>
  onPositionChange(options ? options.map(o => o.value) : [])
}
        />
      </div>
    </>
  );
}
