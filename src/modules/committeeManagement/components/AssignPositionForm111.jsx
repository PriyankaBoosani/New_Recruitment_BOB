import React from 'react';
import { FaPlus } from 'react-icons/fa';

const AssignPositionForm = ({
  requisitions,
  positions,
  formData,
  setFormData,
  onAssign
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="position-form">
      <h6>Assign Positions</h6>
      <p>Assign positions to the interview panel members</p>
      
      <div className="form-row">
        <div className="form-group">
          <label>Requisition</label>
          <select 
            className="form-control"
            name="requisitionId" 
            value={formData.requisitionId || ''} 
            onChange={handleChange}
          >
            <option value="">Select Requisition</option>
            {requisitions.map(req => (
              <option key={req.id} value={req.id}>
                {req.requisitionCode}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Position</label>
          <select 
            className="form-control"
            name="positionId" 
            value={formData.positionId || ''} 
            onChange={handleChange}
          >
            <option value="">Select Position</option>
            {positions.map(pos => (
              <option key={pos.id} value={pos.id}>
                {pos.positionName}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className="btn-primary"
          onClick={onAssign}
          disabled={!formData.requisitionId || !formData.positionId}
        >
          <FaPlus /> Assign
        </button>
      </div>
    </div>
  );
};

export default AssignPositionForm;
