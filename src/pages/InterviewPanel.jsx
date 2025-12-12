// src/pages/InterviewPanel.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal, Dropdown } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { ValidateForm, ValidateInterviewPanel } from '../validators/common-validations';
import '../css/user.css';
import viewIcon from "../assets/view_icon.png";
import deleteIcon from "../assets/delete_icon.png";
import editIcon from "../assets/edit_icon.png";
import ErrorMessage from '../components/ErrorMessage';
import { FileMeta, downloadTemplate, importFromCSV } from '../components/FileUpload';

const InterviewPanel = () => {
  const [panels, setPanels] = useState([
    { id: 1, name: 'Application Screening Panel', members: 'Harsha Tatapudi, Manaswi Puttamarju' },
    { id: 2, name: 'Document Verification Panel', members: 'Mahesh Allvar, Sumanth Sangam, Vamshi Vaddempudi' },
    { id: 3, name: 'Eligibility Screening Committee', members: 'Aftab Khan, Sathvik Pothumanchi' },
    { id: 4, name: 'Shortlisting Panel', members: 'Veeresh Vadlamani, Barat Thumma' },
    { id: 5, name: 'Pre-Screening Evaluation Team', members: 'Sarish Jindham, Naresh Palarapu, Vijay Villuri' },
  ]);

  // derive a default list of members from initial panels (unique)
  const defaultMembersSet = Array.from(new Set(
    panels.flatMap(p => (String(p.members || '').split(',').map(x => x.trim()).filter(Boolean)))
  ));
  const [membersOptions] = useState(defaultMembersSet.length ? defaultMembersSet : [
    'Harsha Tatapudi',
    'Manaswi Puttamarju',
    'Mahesh Allvar',
    'Sumanth Sangam',
    'Vamshi Vaddempudi',
    'Aftab Khan',
    'Sathvik Pothumanchi',
    'Veeresh Vadlamani',
    'Barat Thumma',
    'Sarish Jindham',
    'Naresh Palarapu',
    'Vijay Villuri'
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [activeTab, setActiveTab] = useState('manual');
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  // while editing, members is an array; will convert to string on save
  const [formData, setFormData] = useState({ name: '', members: [] });
  const [errors, setErrors] = useState({});

  // ----- File helpers (same as Department)
  const onSelectCSV = (file) => setSelectedCSVFile(file ?? null);
  const onSelectXLSX = (file) => setSelectedXLSXFile(file ?? null);
  const removeCSV = () => setSelectedCSVFile(null);
  const removeXLSX = () => setSelectedXLSXFile(null);

  // import wrapper using shared helper (mirrors Department: simple mapping, no validation)
  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: panels,
      setList: setPanels,
      mapRow: (row) => ({
        name: (row.name ?? row.panel_name ?? row['panel'] ?? '').trim(),
        members: (row.members ?? row.panel_members ?? row['member_list'] ?? '').trim(),
      }),
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab
    });
  };

  // clear per-field error on change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setErrors(prev => {
      const copy = { ...prev };
      if (copy[name]) delete copy[name];
      return copy;
    });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // toggle selection for a member (keeps formData.members as an array)
  const toggleMember = (member) => {
    setErrors(prev => {
      const copy = { ...prev };
      if (copy.members) delete copy.members;
      return copy;
    });

    setFormData(prev => {
      const cur = Array.isArray(prev.members) ? [...prev.members] : [];
      const idx = cur.indexOf(member);
      if (idx === -1) cur.push(member);
      else cur.splice(idx, 1);
      return { ...prev, members: cur };
    });
  };

  // remove a single member (used by pill 'x' button)
  const removeMemberPill = (e, member) => {
    e.stopPropagation(); // prevent dropdown toggle from closing/opening
    setFormData(prev => {
      const cur = Array.isArray(prev.members) ? [...prev.members] : [];
      return { ...prev, members: cur.filter(m => m !== member) };
    });
  };

  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', members: [] });
    setErrors({});
    setActiveTab('manual');
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };

  const openEdit = (p) => {
    setIsEditing(true);
    setEditingId(p.id);
    const membersArray = String(p.members || '')
      .split(',')
      .map(x => x.trim())
      .filter(Boolean);
    setFormData({ name: p.name, members: membersArray });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrors({});

    // Convert members array (in UI) to array/string as the validator accepts both
    const payloadForValidation = {
      name: formData.name,
      members: formData.members // can be array or comma-separated string
    };

    const result = ValidateInterviewPanel(payloadForValidation);

    if (!result.valid) {
      setErrors(result.errors);
      // focus first invalid field
      const first = Object.keys(result.errors)[0];
      if (first) {
        const el = document.querySelector(`[name="${first}"]`);
        if (el && el.focus) el.focus();
      }
      return;
    }

    // normalized values returned from validator (trimmed name + members array)
    const normalized = result.normalized;

    const payloadToSave = {
      name: normalized.name,
      members: (Array.isArray(normalized.members) ? normalized.members.join(', ') : String(normalized.members || '').trim())
    };

    if (isEditing) {
      setPanels(prev => prev.map(p => p.id === editingId ? { ...p, ...payloadToSave } : p));
    } else {
      const newItem = { id: Math.max(0, ...panels.map(p => p.id)) + 1, ...payloadToSave };
      setPanels(prev => [...prev, newItem]);
    }

    // reset form & modal state
    setShowAddModal(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', members: [] });
    setErrors({});
  };


  // delete handlers
  const openDeleteModal = (p) => {
    setDeleteTarget({ id: p.id, name: p.name });
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setPanels(prev => prev.filter(p => p.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // filtering & pagination
  const filtered = panels.filter(p =>
    [p.name, p.members].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginate = (num) => setCurrentPage(num);

  // small inline styles for pills and checkmark (adjust in CSS if preferred)
  const pillStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: 16,
    background: '#eef2f7',
    color: '#333',
    marginRight: 6,
    marginBottom: 6,
    fontSize: 13
  };
  const pillCloseStyle = {
    display: 'inline-block',
    marginLeft: 8,
    cursor: 'pointer',
    fontWeight: 700
  };

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h2>Interview Panels</h2>

          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search Panel"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="search-input"
              />
            </div>

            <Button variant="primary" className="add-button" onClick={openAdd}>
              <Plus size={20} className="me-1" /> Add
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <Table hover className="user-table">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Panel Name</th>
                <th>Panel Members</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {current.length ? current.map((p, i) => (
                <tr key={p.id}>
                  <td>{indexOfFirst + i + 1}</td>
                  <td data-label="Panel Name:">{p.name}</td>
                  <td data-label="Panel Members:">{p.members}</td>

                  <td>
                    <div className="action-buttons">
                      <Button variant="link" className="action-btn view-btn"><img src={viewIcon} className="icon-16" alt="view" /></Button>
                      <Button variant="link" className="action-btn edit-btn" onClick={() => openEdit(p)}><img src={editIcon} className="icon-16" alt="edit" /></Button>
                      <Button variant="link" className="action-btn delete-btn" onClick={() => openDeleteModal(p)}><img src={deleteIcon} className="icon-16" alt="delete" /></Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center">No Panels Found</td></tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="pagination-container">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <li key={n} className={`page-item ${n === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(n)}>{n}</button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Modal */}
        <Modal
          show={showAddModal}
          onHide={() => { setShowAddModal(false); setIsEditing(false); setEditingId(null); }}
          size="lg"
          centered
          className="user-modal"
          fullscreen="sm-down"
          scrollable
        >
          <Modal.Header closeButton className="modal-header-custom">
            <div>
              <Modal.Title>{isEditing ? "Edit Panel" : "Add Panel"}</Modal.Title>
              <p className="small text-muted para">Choose to add manually or import from CSV/XLSX file.</p>
            </div>
          </Modal.Header>

          <Modal.Body className="p-4">
            {!isEditing && (
              <div className="tab-buttons mb-4">
                <Button
                  variant={activeTab === "manual" ? "light" : "outline-light"}
                  className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
                  onClick={() => setActiveTab("manual")}
                >
                  Manual Entry
                </Button>
                <Button
                  variant={activeTab === "import" ? "light" : "outline-light"}
                  className={`tab-button ${activeTab === "import" ? "active" : ""}`}
                  onClick={() => setActiveTab("import")}
                >
                  Import File
                </Button>
              </div>
            )}

            {activeTab === "manual" ? (
              <Form onSubmit={handleSave} noValidate>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Panel Name <span className='text-danger'>*</span></Form.Label>
                      <Form.Control name="name" value={formData.name} onChange={handleInput} placeholder="Enter Panel Name" className="form-control-custom" />
                      <ErrorMessage>{errors.name}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Panel Members <span className='text-danger'>*</span></Form.Label>

                      {/* DROPDOWN multi-select with pills + checkmarks */}
                      <Dropdown autoClose="outside">
                        <Dropdown.Toggle
                          id="members-dropdown"
                          className="form-control-custom d-flex align-items-center justify-content-between buttonnonebg"
                          style={{ minHeight: 48, padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}
                        >
                          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', flex: 1 }}>
                            {/* show pills for selected */}
                            {Array.isArray(formData.members) && formData.members.length > 0 ? (
                              formData.members.map(m => (
                                <div key={m} style={pillStyle} className='hovbg' onClick={(e) => e.stopPropagation()}>
                                  <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block' }}>{m}</span>
                                  <span style={pillCloseStyle} onClick={(e) => removeMemberPill(e, m)} aria-hidden>×</span>
                                </div>
                              ))
                            ) : (
                              <div style={{ color: '#9aa0a6' }}>Please select...</div>
                            )}
                          </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ minWidth: 300, maxHeight: '86px', overflowY: 'auto', padding: '0.5rem' }}>
                          <div className="small text-muted mb-2 px-1">Select one or more members</div>

                          {membersOptions.map(m => {
                            const selected = Array.isArray(formData.members) && formData.members.includes(m);
                            return (
                              <div
                                key={m}
                                role="button"
                                onClick={() => toggleMember(m)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '8px 10px',
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  background: selected ? '#f5fbff' : 'transparent',
                                  marginBottom: 6
                                }}
                              >
                                <div>{m}</div>
                                <div style={{ width: 20, textAlign: 'center' }}>
                                  {selected ? <span>✓</span> : null}
                                </div>
                              </div>
                            );
                          })}

                        
                        </Dropdown.Menu>
                      </Dropdown>
                                            <ErrorMessage>{errors.members}</ErrorMessage>

                    </Form.Group>
                  </Col>
                </Row>

                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingId(null); }}>Cancel</Button>
                  <Button variant="primary" type="submit">{isEditing ? "Update" : "Save"}</Button>
                </Modal.Footer>
              </Form>
            ) : (
              <>
                <div className="import-area p-4 rounded" style={{ background: "#fceee9" }}>
                  <div className="text-center mb-3">
                    <div style={{ width: 72, height: 72, borderRadius: 12, background: "#fff", display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                      <Upload size={32} />
                    </div>
                    <h5 className="uploadfile">Upload File</h5>
                    <p className="small text-muted">CSV/XLSX supported (Headers: name, members)</p>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                    <div>
                      <input id="panel-csv" type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => onSelectCSV(e.target.files[0] ?? null)} />
                      <label htmlFor="panel-csv">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload CSV</Button>
                      </label>
                    </div>

                    <div>
                      <input id="panel-xlsx" type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: 'none' }} onChange={(e) => onSelectXLSX(e.target.files[0] ?? null)} />
                      <label htmlFor="panel-xlsx">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload XLSX</Button>
                      </label>
                    </div>

                    <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
                    <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />
                  </div>

                  <div className="text-center mt-4 small">
                    Download template:&nbsp;
                    <Button variant="link" className='btnfont' onClick={() => downloadTemplate('csv')}>CSV</Button>
                    &nbsp;|&nbsp;
                    <Button variant="link" className='btnfont' onClick={() => downloadTemplate('xlsx')}>XLSX</Button>
                  </div>
                </div>

                <Modal.Footer className="modal-footer-custom px-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setActiveTab('manual'); }}>Cancel</Button>
                  <Button variant="primary" onClick={handleImport}>Import</Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Body>
        </Modal>

        {/* Delete confirmation */}
        <Modal show={showDeleteModal} onHide={cancelDelete} centered dialogClassName="delete-confirm-modal">
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this panel?</p>
            {deleteTarget && <div className="delete-confirm-user"><strong>{deleteTarget.name}</strong></div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={cancelDelete}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default InterviewPanel;
