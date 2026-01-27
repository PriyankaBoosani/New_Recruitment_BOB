import React from 'react';
import { FiCalendar, FiUsers, FiEdit2, FiTrash2, FiFilter } from 'react-icons/fi';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const CommitteeHistoryList = ({ 
  history = [ {
      id: 1,
      reference: 'BOB/HRM/REC/ADVT/2025/06',
      product: 'Product - ONDC',
      panelType: 'Interview',
      panelName: 'Interview Panel 1',
      startDate: '10-01-2026',
      endDate: '21-01-2026',
      members: ['Veeresh V', 'Naresh P', 'Vijay V']
    },{id: 2,
      reference: 'BOB/HRM/REC/ADVT/2025/06',
      product: 'Product - ONDC',
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
      <div className="history-header">
        <h6>Committee History</h6>
        {/* <button className="filter-btn">Filters</button> */}
      </div>

      {history.map((item) => (
            <div key={item.id} className="history-card">
            <div className="d-flex justify-content-between align-items-center">
                <div className="title">
                <span className="requisition-highlight">{item.requisitionCode}</span>
                <span className="mx-2 text-muted">-</span>
                <span className="position-title">{item.positionName}</span>
                </div>
                <div className="actions">
                {/* Edit/Delete Icons with slim circular borders */}
                <button className="btn-outline-edit"><FiEdit2 /></button>
                <button className="btn-outline-delete"><FiTrash2 /></button>
                </div>
            </div>

            <div className="d-flex align-items-center gap-3 mt-3">
                <span className="panel-type">{item.panelType}</span>
                <span className="fw-bold" style={{fontSize: '14px'}}>{item.panelName}</span>
                <div className="members d-flex gap-2">
                {item.members.map(m => (
                    <span className="chip-light">{m}</span>
                ))}
                </div>
            </div>

            <div className="mt-3 text-muted" style={{ fontSize: '12px' }}>
                Start Date: <strong>{item.startDate}</strong> &nbsp; End Date: <strong>{item.endDate}</strong>
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
