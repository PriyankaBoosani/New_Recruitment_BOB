// src/pages/Position.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload, X as XIcon } from 'react-bootstrap-icons';
import { ValidateForm } from '../validators/common-validations';
import '../css/user.css';
import viewIcon from "../assets/view_icon.png";
import deleteIcon from "../assets/delete_icon.png";
import editIcon from "../assets/edit_icon.png";
import ErrorMessage from '../components/ErrorMessage';
import { FileMeta, downloadTemplate, importFromCSV } from '../components/FileUpload';

const Position = () => {
  // sample departments & job grades (replace with API data if required)
  const [departments] = useState([
    'Information Technology', 'Human Resources', 'Finance', 'Marketing', 'Operations', 'Market Risk', 'Integrated Risk Management'
  ]);
  const [jobGrades] = useState(['JG1', 'JG2', 'JG3', 'JG4']);

  // sample positions
  const [positions, setPositions] = useState([
    { id: 1, title: 'Frontend Developer', department: 'Information Technology', jobGrade: 'JG2', description: 'React/JS developer' },
    { id: 2, title: 'HR Executive', department: 'Human Resources', jobGrade: 'JG1', description: 'Recruitment & onboarding' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [activeTab, setActiveTab] = useState('manual'); // manual | import
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    jobGrade: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // --- File helpers (same as Department)
  const onSelectCSV = (file) => setSelectedCSVFile(file ?? null);
  const onSelectXLSX = (file) => setSelectedXLSXFile(file ?? null);
  const removeCSV = () => setSelectedCSVFile(null);
  const removeXLSX = () => setSelectedXLSXFile(null);

  // import wrapper using shared helper (mirrors Department: simple mapping, no validateRow)
  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: positions,
      setList: setPositions,
      // simple mapping - mirror possible header variants to Position fields
      mapRow: (row) => ({
        title: (row.positionTitle ?? row.positiontitle ?? row.title ?? row.name ?? '').trim(),
        department: (row.department ?? row.dept ?? '').trim(),
        jobGrade: (row.jobGrade ?? row.jobgrade ?? row.gradecode ?? row.grade ?? '').trim(),
        description: (row.description ?? row.desc ?? '').trim()
      }),
      // no validateRow (same behaviour as Department)
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab
    });
  };

  // --- Input handler (clears per-field error same pattern as Department)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => {
      const copy = { ...prev };
      if (copy[name]) delete copy[name];
      return copy;
    });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ title: '', department: '', jobGrade: '', description: '' });
    setErrors({});
    setActiveTab('manual');
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };

  const openEditModal = (p) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormData({
      title: p.title || '',
      department: p.department || '',
      jobGrade: p.jobGrade || '',
      description: p.description || ''
    });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      title: String(formData.title || '').trim(),
      department: String(formData.department || '').trim(),
      jobGrade: String(formData.jobGrade || '').trim(),
      description: String(formData.description || '').trim()
    };

    const { valid, errors: vErrors } = ValidateForm(payload, {
      existing: positions,
      currentId: isEditing ? editingId : null
    });

    if (!valid) {
      setErrors(vErrors);
      // focus first invalid field
      const first = Object.keys(vErrors)[0];
      if (first) {
        const el = document.querySelector(`[name="${first}"]`);
        if (el && el.focus) el.focus();
      }
      return;
    }

    if (isEditing) {
      setPositions(prev => prev.map(it => it.id === editingId ? { ...it, ...payload } : it));
    } else {
      const newItem = { id: Math.max(0, ...positions.map(p => p.id)) + 1, ...payload };
      setPositions(prev => [...prev, newItem]);
    }

    // reset form & modal state (same as Department)
    setShowAddModal(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({ title: '', department: '', jobGrade: '', description: '' });
  };

  const openDeleteModal = (p) => {
    setDeleteTarget({ id: p.id, name: p.title });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setPositions(prev => prev.filter(p => p.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Filter & paginate
  const filtered = positions.filter(p =>
    [p.title, p.department, p.jobGrade, p.description].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginate = (num) => setCurrentPage(num);

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h2>Positions</h2>
          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by title, department, grade or description"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="search-input"
              />
            </div>

            <Button variant="primary" className="add-button" onClick={openAddModal}>
              <Plus size={20} className="me-1" /> Add
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <Table hover className="user-table">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Position Title</th>
                <th>Department</th>
                <th>Job Grade</th>
                <th>Description</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.length > 0 ? current.map((p, idx) => (
                <tr key={p.id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td data-label="Position Title: ">&nbsp;{p.title}</td>
                  <td data-label="Department: ">&nbsp;{p.department}</td>
                  <td data-label="Job Grade: ">&nbsp;{p.jobGrade}</td>
                  <td data-label="Description: ">&nbsp;{p.description}</td>
                  <td>
                    <div className="action-buttons">
                      <Button variant="link" className="action-btn view-btn" title="View">
                        <img src={viewIcon} alt="View" className="icon-16" />
                      </Button>
                      <Button variant="link" className="action-btn edit-btn" title="Edit" onClick={() => openEditModal(p)}>
                        <img src={editIcon} alt="Edit" className="icon-16" />
                      </Button>
                      <Button variant="link" className="action-btn delete-btn" title="Delete" onClick={() => openDeleteModal(p)}>
                        <img src={deleteIcon} alt="Delete" className="icon-16" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center">No positions found</td></tr>
              )}
            </tbody>
          </Table>
        </div>

        {filtered.length > 0 && (
          <div className="pagination-container">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button onClick={() => paginate(number)} className="page-link">{number}</button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Add/Edit Modal */}
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
              <Modal.Title>{isEditing ? 'Edit Position' : 'Add Position'}</Modal.Title>
              <p className="mb-0 small text-muted para">Choose to add manually or import from CSV/XLSX file.</p>
            </div>
          </Modal.Header>

          <Modal.Body className="p-4">
            {!isEditing && (
              <div className="tab-buttons mb-4">
                <Button variant={activeTab === 'manual' ? 'light' : 'outline-light'} className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => setActiveTab('manual')}>Manual Entry</Button>
                <Button variant={activeTab === 'import' ? 'light' : 'outline-light'} className={`tab-button ${activeTab === 'import' ? 'active' : ''}`} onClick={() => setActiveTab('import')}>Import File</Button>
              </div>
            )}

            {activeTab === 'manual' ? (
              <Form onSubmit={handleSave} noValidate>
                <Row className="g-3">
                  <Col xs={12} md={12}>
                    <Form.Group controlId="formTitle" className="form-group">
                      <Form.Label className="form-label">Position Title <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control-custom" placeholder="Enter position title" aria-invalid={!!errors.title} aria-describedby="titleError" />
                      <ErrorMessage id="titleError">{errors.title}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formDepartment" className="form-group">
                      <Form.Label className="form-label">Department <span className="text-danger">*</span></Form.Label>
                      <Form.Select name="department" value={formData.department} onChange={handleInputChange} className="form-control-custom" aria-invalid={!!errors.department} aria-describedby="departmentError">
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </Form.Select>
                      <ErrorMessage id="departmentError">{errors.department}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formJobGrade" className="form-group">
                      <Form.Label className="form-label">Job Grade <span className="text-danger">*</span></Form.Label>
                      <Form.Select name="jobGrade" value={formData.jobGrade} onChange={handleInputChange} className="form-control-custom" aria-invalid={!!errors.jobGrade} aria-describedby="jobGradeError">
                        <option value="">Select Job Grade</option>
                        {jobGrades.map(g => <option key={g} value={g}>{g}</option>)}
                      </Form.Select>
                      <ErrorMessage id="jobGradeError">{errors.jobGrade}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="formDescription" className="form-group">
                      <Form.Label className="form-label">Description <span className="text-danger">*</span></Form.Label>
                      <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} className="form-control-custom" placeholder="Add description ..." />
                      <ErrorMessage>{errors.description}</ErrorMessage>
                    </Form.Group>
                  </Col>
                </Row>

                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingId(null); }}>Cancel</Button>
                  <Button variant="primary" type="submit">{isEditing ? 'Update' : 'Save'}</Button>
                </Modal.Footer>
              </Form>
            ) : (
              <>
                <div className="import-area p-4 rounded" style={{ background: '#fceee9' }}>
                  <div className="text-center mb-3">
                    <div style={{ width: 72, height: 72, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', marginBottom: '1rem' }}>
                      <Upload size={32} />
                    </div>
                    <h5 className="mb-2 uploadfile">Upload File</h5>
                    <p className="text-muted small">Support for CSV and XLSX formats (CSV headers: positionTitle,department,jobGrade,description)</p>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                    <div>
                      <input id="upload-csv-pos" type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => onSelectCSV(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-csv-pos">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload CSV</Button>
                      </label>
                    </div>

                    <div>
                      <input id="upload-xlsx-pos" type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: 'none' }} onChange={(e) => onSelectXLSX(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-xlsx-pos">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload XLSX</Button>
                      </label>
                    </div>

                    <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
                    <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />
                  </div>

                  <div className="text-center mt-4 small">
                    Download template:&nbsp;
                    <Button variant="link" className='btnfont' onClick={() =>
                      downloadTemplate(
                        ['title', 'department', 'jobGrade', 'description'],
                        ['Frontend Developer', 'Information Technology', 'JG2', 'React/JS developer'],
                        'position-template',
                        'csv'
                      )}>CSV</Button>
                    &nbsp;|&nbsp;
                    <Button variant="link" className='btnfont' onClick={() =>
                      downloadTemplate(
                        ['title', 'department', 'jobGrade', 'description'],
                        ['Frontend Developer', 'Information Technology', 'JG2', 'React/JS developer'],
                        'position-template',
                        'xlsx'
                      )
                    }>XLSX</Button>
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

        {/* Delete Confirmation */}
        <Modal show={showDeleteModal} onHide={cancelDelete} centered dialogClassName="delete-confirm-modal">
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this position?</p>
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

export default Position;
