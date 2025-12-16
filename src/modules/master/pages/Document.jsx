// src/pages/Documents.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { validateDocumentForm } from '../../../shared/utils/document-validations';
import '../../../style/css/user.css';
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import editIcon from "../../../assets/edit_icon.png";
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { FileMeta, downloadTemplate, importFromCSV } from '../../../shared/components/FileUpload';

const Documents = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Aadhar Card', description: 'Proof of identity' },
    { id: 2, name: 'Pan Card', description: 'Tax identity proof' },
    { id: 3, name: '10th Certificate', description: 'Secondary School Certificate' },
    { id: 4, name: 'Intermediate Certificate', description: 'Higher Secondary / Inter Certificate' },
    { id: 5, name: 'Diploma Certificate', description: 'Diploma / Polytechnic Certificate' },
    { id: 6, name: 'Degree Certificate', description: "Graduation / Bachelor's Degree Certificate" },
    { id: 7, name: 'Post Graduation Certificate', description: "Master's / Post Graduate Degree Certificate" },
    { id: 8, name: 'Work Experience', description: 'Proof of prior employment' },
    { id: 9, name: 'Caste Certificate', description: 'Community / Caste proof as required' },
    { id: 10, name: 'Income Certificate', description: 'Income proof as required' },
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

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  // wrapper for import that delegates to shared importFromCSV helper
  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: documents,
      setList: setDocuments,
      mapRow: (row) => ({
        name: (row.name ?? row.documentname ?? row.document_name ?? '').trim(),
        description: (row.description ?? row.desc ?? '').trim()
      }),
      // no per-row validation (same as Department behaviour)
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab
    });
  };

  // helpers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // clear field-specific error on change
    setErrors(prev => {
      const copy = { ...prev };
      if (copy[name]) delete copy[name];
      return copy;
    });

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // small helpers to show and clear selected files (these state setters come from this file)
  const onSelectCSV = (file) => {
    setSelectedCSVFile(file ?? null);
  };
  const onSelectXLSX = (file) => {
    setSelectedXLSXFile(file ?? null);
  };
  const removeCSV = () => setSelectedCSVFile(null);
  const removeXLSX = () => setSelectedXLSXFile(null);

  // Open modal for Add
  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setErrors({});
    setActiveTab('manual');
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };

  // Open modal for Edit (populate form)
  const openEditModal = (d) => {
    setIsEditing(true);
    setEditingId(d.id);
    setFormData({ name: d.name || '', description: d.description || '' });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  // Save handler (both add & update) using validator
  const handleSave = (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name: String(formData.name || '').trim(),
      description: String(formData.description || '').trim()
    };

    const { valid, errors: vErrors } = validateDocumentForm(payload, {
      existing: documents,
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
      setDocuments(prev => prev.map(item => item.id === editingId ? { ...item, ...payload } : item));
    } else {
      const newItem = { id: Math.max(0, ...documents.map(d => d.id)) + 1, ...payload };
      setDocuments(prev => [...prev, newItem]);
    }

    setShowAddModal(false);
  };

  const openDeleteModal = (d) => {
    setDeleteTarget({ id: d.id, name: d.name });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDocuments(prev => prev.filter(d => d.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // filtering & pagination
  const filtered = documents.filter(d =>
    [d.name, d.description].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h2>Documents</h2>
          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by document name or description"
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
                <th>Document Name</th>
                <th>Description</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.length > 0 ? current.map((d, idx) => (
                <tr key={d.id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td data-label="Document Name:">&nbsp;{d.name}</td>
                  <td data-label="Description:">&nbsp;{d.description}</td>
                  <td>
                    <div className="action-buttons">
                      <Button variant="link" className="action-btn view-btn" title="View">
                        <img src={viewIcon} alt="View" className="icon-16" />
                      </Button>
                      <Button variant="link" className="action-btn edit-btn" title="Edit" onClick={() => openEditModal(d)}>
                        <img src={editIcon} alt="Edit" className="icon-16" />
                      </Button>
                      <Button variant="link" className="action-btn delete-btn" title="Delete" onClick={() => openDeleteModal(d)}>
                        <img src={deleteIcon} alt="Delete" className="icon-16" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center">No documents found</td></tr>
              )}
            </tbody>
          </Table>
        </div>

        {filtered.length > 0 && (
          <div className="pagination-container">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button onClick={() => setCurrentPage(number)} className="page-link">{number}</button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
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
          dialogClassName="user-modal-dialog"
          className="user-modal"
          fullscreen="sm-down"
          scrollable
          container={typeof document !== 'undefined' ? document.body : undefined}
        >
          <Modal.Header closeButton className="modal-header-custom">
            <div>
              <Modal.Title>{isEditing ? 'Edit Document' : 'Add Document'}</Modal.Title>
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
                    <Form.Group controlId="formName" className="form-group">
                      <Form.Label className="form-label">Document Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control-custom" placeholder="Enter document name" aria-invalid={!!errors.name} aria-describedby="nameError" />
                      <ErrorMessage id="nameError">{errors.name}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="formDescription" className="form-group">
                      <Form.Label className="form-label">Description <span className="text-danger">*</span></Form.Label>
                      <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} className="form-control-custom" placeholder="Enter description" aria-invalid={!!errors.description} aria-describedby="descError" />
                      <ErrorMessage id="descError">{errors.description}</ErrorMessage>
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
                    <div style={{ width: 72, height: 72, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                      <Upload size={32} />
                    </div>
                    <h5 className="text-center uploadfile">Upload File</h5>
                    <p className="text-center small">Support for CSV and XLSX formats (CSV headers: name,description)</p>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                    <div>
                      <input id="upload-csv-doc" type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => onSelectCSV(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-csv-doc">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload CSV</Button>
                      </label>
                    </div>

                    <div>
                      <input id="upload-xlsx-doc" type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={(e) => onSelectXLSX(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-xlsx-doc">
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

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered dialogClassName="delete-confirm-modal" container={typeof document !== 'undefined' ? document.body : undefined}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this document?</p>
            {deleteTarget && <div className="delete-confirm-user"><strong>{deleteTarget.name}</strong></div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>

      </div>
    </Container>
  );
};

export default Documents;
