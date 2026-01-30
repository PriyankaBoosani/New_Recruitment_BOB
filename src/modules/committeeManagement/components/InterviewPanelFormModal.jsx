import React from "react";
import Select from "react-select";

const InterviewPanelFormModal = ({
  communityOptions = [],
  membersOptions = [],
  formData,
  setFormData,
  onSave
}) => {
  console.log("communityOptions", communityOptions);
  return (
    <>
      <span className="card-title">Create New Panel</span>
      <p className="card-subtitle">Create and manage panels</p>

      {/* Panel Name */}
      <div className="form-group">
        <label>Panel Name *</label>
        <input
          className="form-control"
          placeholder="Enter Panel Name"
          value={formData.name}
          onChange={e =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
      </div>

      {/* Panel Type */}
      <div className="form-group">
        <label>Panel Type *</label>
        <select
  className="form-control"
  value={formData.community}
  onChange={e =>
    setFormData({ ...formData, community: e.target.value })
  }
>
  <option value="">Select Panel Type</option>
  {communityOptions.map(option => (
    <option key={option.id} value={option.id}>
      {option.name}
    </option>
  ))}
</select>
      </div>

      {/* Panel Members */}
      <div className="form-group">
        <label>Panel Members *</label>

        <Select
          isMulti
          options={membersOptions}
          placeholder="Select members"
          closeMenuOnSelect={false}
          value={membersOptions.filter(option =>
            formData.members.includes(option.value)
          )}
          onChange={(selectedOptions) =>
            setFormData({
              ...formData,
              members: selectedOptions
                ? selectedOptions.map(o => o.value)
                : []
            })
          }
          classNamePrefix="react-select"
        />
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
