import React from 'react';
import { FiCalendar, FiUsers, FiEdit2, FiTrash2, FiFilter } from 'react-icons/fi';
import edit_icon from "../../../assets/edit_icon.png"
import delete_icon from "../../../assets/delete_icon.png"
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const CommitteeHistoryList = ({ 
  history = [ {
      id: 1,
      requisitionCode: 'BOB/HRM/REC/ADVT/2025/06',
      positionName: 'Product - ONDC',
      panelType: 'Interview',
      panelName: 'Interview Panel 1',
      startDate: '10-01-2026',
      endDate: '21-01-2026',
      members: ['Veeresh V', 'Naresh P', 'Vijay V']
    },{id: 2,
      requisitionCode: 'BOB/HRM/REC/ADVT/2025/06',
      positionName: 'Product - ONDC',
      panelType: 'Interview',
      panelName: 'Interview Panel 1',
      startDate: '10-01-2026',
      endDate: '21-01-2026',
      members: ['Veeresh V', 'Naresh P', 'Vijay V']
    }], 
  loading = false, 
  onEdit = () => {}, 
  onDelete = () => {} 
}) => {
  return (
     <div className="history-section">
      <div className="history-header d-flex justify-content-between align-items-center mb-3">
        <span className="committee-title">Committee History</span>
        {/* optional filter button */}
      </div>

      {history.map((item) => (
        <div key={item.id} className="history-card">
          {/* ===== TOP ROW ===== */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="history-title">
              <span className="history-requisition-code">
                {item.requisitionCode}
              </span>
              <span className="mx-1">-</span>
              <span className="history-position-title">
                {item.positionName}
              </span>
            </div>

            <div className="card-actions">
              <button
                className="history-icon-btn edit"
                onClick={() => onEdit(item)}
              >
                {/* <FiEdit2 /> */}  <img src={edit_icon} alt="Edit" />
              </button>
              <button
                className="history-icon-btn delete"
                onClick={() => onDelete(item)}
              >
                {/* <FiTrash2 /> */}  <img src={delete_icon} alt="Delete" />
              </button>
            </div>
          </div>

          {/* ===== PANEL INFO ===== */}
          <div className="d-flex align-items-center gap-3 mt-2 flex-wrap">
            <span className="panel-badge">
              {item.panelType}
            </span>

            <span className="panel-name">
              {item.panelName}
            </span>

            <div className="members d-flex gap-2 flex-wrap">
              {item.members?.map((m, idx) => (
                <span key={idx} className="member-chip">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* ===== DATES ===== */}
          <div className="dates mt-2">
             <span>Start Date: {item.startDate}</span>
            <span >End Date: {item.endDate}</span>
          </div>
        </div>
      ))}

      {history.length === 0 && (
        <div className="text-center py-4 text-muted">
          No committee assignment history found
        </div>
      )}
    </div>
  );
};

export default CommitteeHistoryList;
