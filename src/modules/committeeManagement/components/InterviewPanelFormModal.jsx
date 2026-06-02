import React from "react";
import Select from "react-select";
import { OverlayTrigger, Popover } from "react-bootstrap";
import I_icon from "../../../assets/I_icon.png";
import { useTranslation } from "react-i18next";

const InterviewPanelFormModal = ({
  communityOptions = [],
  membersOptions = [],
  // centerOptions = [],
  formData,
  setFormData,
  onSave,
  errors,
  setErrors,
  clearError,
  disableName = false,
  disableType = false,
}) => {
  const { t } = useTranslation(["interviewPanelCommittee", "common"]);

  const panelConstitutionPopover = (
    <Popover id="panel-constitution-popover">
      <Popover.Header as="h6">
        {t("interviewPanelCommittee:panel_constitution_guidelines")}
      </Popover.Header>
      <Popover.Body>
        <ul style={{ paddingLeft: "16px", margin: "6px 0" }}>
          <li>
            {t("interviewPanelCommittee:at_least_one")} <b>{t("interviewPanelCommittee:woman")}</b>{" "}
            {t("interviewPanelCommittee:member")}
          </li>
          <li>
            {t("interviewPanelCommittee:at_least_one")}{" "}
            <b>{t("interviewPanelCommittee:minority")}</b> {t("interviewPanelCommittee:member")}
          </li>
          <li>
            {t("interviewPanelCommittee:at_least_one")} <b>{t("interviewPanelCommittee:scst")}</b>{" "}
            {t("interviewPanelCommittee:member")}
          </li>
          <li>
            {t("interviewPanelCommittee:at_least_one")} <b>{t("interviewPanelCommittee:obc")}</b>{" "}
            {t("interviewPanelCommittee:member")}
          </li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      {/* Panel Name */}
      <div className="form-group">
        <label>
          {t("interviewPanelCommittee:panel_name")} <span className="text-danger">*</span>
        </label>
        <input
          className="form-control"
          placeholder={t("interviewPanelCommittee:enter_panel_name")}
          maxLength={200}
          value={formData.name}
          disabled={disableName}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            clearError("name");
          }}
        />
        {errors?.name && <div className="field-error">{t(errors.name)}</div>}
      </div>

      {/* Panel Type */}
      <div className="form-group">
        <label>
          {t("interviewPanelCommittee:panel_type")} <span className="text-danger">*</span>
        </label>
        <select
          className="form-control"
          value={formData.community}
          disabled={disableType}
          onChange={(e) => {
            setFormData({ ...formData, community: e.target.value });
            clearError?.("community");
          }}
        >
          <option value="">{t("interviewPanelCommittee:select_panel_type")}</option>
          {communityOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {errors?.community && <div className="field-error">{t(errors.community)}</div>}
      </div>

      {/* Panel Members */}
      <div className="form-group">
        <label>
          {t("interviewPanelCommittee:panel_members")} <span className="text-danger">*</span>
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={panelConstitutionPopover}
            rootClose
          >
            <span className="info-icon" style={{ cursor: "pointer" }}>
              <img src={I_icon} alt="info_icon" className="infoicon-16" />
            </span>
          </OverlayTrigger>
        </label>

        <Select
          isMulti
          options={membersOptions}
          placeholder={t("interviewPanelCommittee:select_members")}
          closeMenuOnSelect={false}
          value={membersOptions.filter((option) => formData.members.includes(option.value))}
          onChange={(selectedOptions) => {
            setFormData({
              ...formData,
              members: selectedOptions ? selectedOptions.map((o) => o.value) : [],
            });
            clearError?.("members");
          }}
          classNamePrefix="react-select"
        />
        {errors?.members && <div className="field-error">{t(errors.members)}</div>}
      </div>
      {/* Interview Center (Zone) */}
      {/* <div className="form-group">
        <label>
          Interview Center / Zone <span className="text-danger">*</span>
        </label>

        <Select
          options={centerOptions}
          placeholder={t("interviewPanelCommittee:select_interview_center")}
          isMulti={false}   // explicitly single select (optional but clear)
          value={
            formData.interviewCenterId
              ? centerOptions.find(opt => opt.value === formData.interviewCenterId)
              : null
          }
          onChange={(selected) => {
            setFormData({
              ...formData,
              interviewCenterId: selected ? selected.value : ""
            });
            clearError?.("interviewCenterId");
          }}
          styles={{
            menuList: (provided) => ({
              ...provided,
              maxHeight: "270px",   // 👈 control height
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            })
          }}
          classNamePrefix="react-select"
        />

        {errors?.interviewCenterId && (
          <div className="field-error">{errors.interviewCenterId}</div>
        )}
      </div> */}

      <div className="panel-form-actions">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            setFormData({ name: "", community: "", members: [] });
            setErrors({});
          }}
        >
          {t("common:cancel")}
        </button>

        <button type="button" className="btn btn-primary" onClick={onSave}>
          {formData.id
            ? t("interviewPanelCommittee:update_panel_button")
            : t("interviewPanelCommittee:save_panel")}
        </button>
      </div>
    </>
  );
};

export default InterviewPanelFormModal;
