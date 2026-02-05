import React from "react";
import Select from "react-select";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FiInfo } from "react-icons/fi";

const InterviewPanelFormModal = ({
  communityOptions = [],
  membersOptions = [],
  formData,
  setFormData,
  onSave,
  errors,
  setErrors,
  clearError
}) => {
  return (
    <>
      <span className="card-title">Create New Panel</span>
      <p className="card-subtitle">Create and manage panels</p>

      {/* Panel Name */}
      <div className="form-group">
        <label>Panel Name <span className="text-danger">*</span></label>
        <input
          className="form-control"
          placeholder="Enter Panel Name"
          value={formData.name}
          onChange={e => {
            setFormData({ ...formData, name: e.target.value });
            clearError("name");
          }}
        />
        {errors?.name && (
          <div className="field-error">{errors.name}</div>
        )}
      </div>

      {/* Panel Type */}
      <div className="form-group">
        <label>Panel Type <span className="text-danger">*</span></label>
        <select
          className="form-control"
          value={formData.community}
          onChange={e => {
            setFormData({ ...formData, community: e.target.value });
            clearError("community");
          }}
        >
          <option value="">Select Panel Type</option>
          {communityOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}

        </select>
        {errors?.community && (
          <div className="field-error">{errors.community}</div>
        )}
      </div>

      {/* Panel Members */}
      <div className="form-group">
        <label>Panel Members <span className="text-danger">*</span><OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="panel-constitution-tooltip">
              <strong>Panel Constitution Guidelines</strong>
              <ul style={{ paddingLeft: "16px", margin: "6px 0" }}>
                <li>At least one <b>Woman</b> member</li>
                <li>At least one <b>Minority</b> member</li>
                <li>At least one <b>SC/ST</b> member</li>
                <li>At least one <b>OBC</b> member</li>
              </ul>
            </Tooltip>
          }
        >
          <span className="info-icon">
            <FiInfo />
          </span>
        </OverlayTrigger></label>



        <Select
          isMulti
          options={membersOptions}
          placeholder="Select members"
          closeMenuOnSelect={false}
          value={membersOptions.filter(option =>
            formData.members.includes(option.value)
          )}
          onChange={(selectedOptions) => {
            setFormData({
              ...formData,
              members: selectedOptions
                ? selectedOptions.map(o => o.value)
                : []
            });
            clearError("members");
          }}

          classNamePrefix="react-select"
        />
        {errors?.members && (
          <div className="field-error">{errors.members}</div>
        )}
      </div>

      <div className="panel-form-actions">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() =>
            setFormData({ name: "", community: "", members: [] })
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onSave}
        >
          {formData.id ? "Update Panel" : "Save Panel"}
        </button>
      </div>
    </>
  );
};

export default InterviewPanelFormModal;
