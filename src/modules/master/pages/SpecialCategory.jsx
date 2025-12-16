// src/pages/SpecialCategory.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { validateSpecialCategoryForm } from '../../../shared/utils/specialcategory-validations';
import '../../../style/css/user.css';
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import editIcon from "../../../assets/edit_icon.png";
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { FileMeta, downloadTemplate, importFromCSV } from '../../../shared/components/FileUpload';


const SpecialCategory = () => {
  const [specials, setSpecials] = useState([
    { id: 1, code: 'PWD', name: 'Persons with Disability', description: 'Reserved for PWD' },
    { id: 2, code: 'EXS', name: 'Ex-Servicemen', description: 'Reserved for Ex-Servicemen' },
    { id: 3, code: 'SPORTS', name: 'Sports', description: 'Sports Quota' },
    { id: 4, code: 'MARTYRS', name: 'Martyrs', description: 'Children/Family of Martyrs' },
    { id: 5, code: 'DEFENCE', name: 'Defence', description: 'Defense Personnel Quota' }
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

  const [formData, setFormData] = useState({ code: '', name: '', description: '' });
  const [errors, setErrors] = useState({});



  // === Updated: import behaves like Department (simple append, no per-row validation) ===
  const handleImport = async () => {
  await importFromCSV({
    selectedCSVFile,
    selectedXLSXFile,
    list: specials,
    setList: setSpecials,
    // simple mapping — accept common header variants and map to the special category shape
    mapRow: (row) => ({
      code: (row.code ?? row.code_name ?? row.title ?? '').trim(),
      name: (row.name ?? row.category ?? row.special_name ?? '').trim(),
      description: (row.description ?? row.desc ?? '').trim()
    }),
    // match Department behaviour: no validateRow
    setSelectedCSVFile,
    setSelectedXLSXFile,
    setShowAddModal,
    setActiveTab
  });
};
 // ----- File helpers (same as Department)
  const onSelectCSV = (file) => setSelectedCSVFile(file ?? null);
  const onSelectXLSX = (file) => setSelectedXLSXFile(file ?? null);
  const removeCSV = () => setSelectedCSVFile(null);
  const removeXLSX = () => setSelectedXLSXFile(null);

  // === end updated import ===

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => { const c = { ...prev }; if (c[name]) delete c[name]; return c; });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ code: '', name: '', description: '' });
    setErrors({});
    setActiveTab('manual');
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };

  const openEditModal = (s) => {
    setIsEditing(true);
    setEditingId(s.id);
    setFormData({ code: s.code || '', name: s.name || '', description: s.description || '' });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      code: String(formData.code || '').trim(),
      name: String(formData.name || '').trim(),
      description: String(formData.description || '').trim()
    };

    const { valid, errors: vErrors } = validateSpecialCategoryForm(payload, {
      existing: specials,
      currentId: isEditing ? editingId : null
    });

    if (!valid) {
      setErrors(vErrors);
      const first = Object.keys(vErrors)[0];
      if (first) {
        const el = document.querySelector(`[name="${first}"]`);
        if (el && el.focus) el.focus();
      }
      return;
    }

    if (isEditing) {
      setSpecials(prev => prev.map(it => it.id === editingId ? { ...it, ...payload } : it));
    } else {
      const newItem = { id: Math.max(0, ...specials.map(s => s.id)) + 1, ...payload };
      setSpecials(prev => [...prev, newItem]);
    }

    setShowAddModal(false);
  };

  const openDeleteModal = (s) => {
    setDeleteTarget({ id: s.id, name: s.name });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setSpecials(prev => prev.filter(s => s.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // filtering & pagination
  const filtered = specials.filter(s =>
    [s.code, s.name, s.description].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h2>Special Categories</h2>
          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by code, name or description"
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
                <th>Code</th>
                <th>Name</th>
                <th>Description</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.length > 0 ? current.map((s, idx) => (
                <tr key={s.id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td data-label="Code: ">&nbsp;{s.code}</td>
                  <td data-label="Name: ">&nbsp;{s.name}</td>
                  <td data-label="Description: ">&nbsp;{s.description}</td>
                  <td>
                    <div className="action-buttons">
                      <Button variant="link" className="action-btn view-btn" title="View">
                        <img src={viewIcon} alt="View" className="icon-16" />
                      </Button>
                      <Button variant="link" className="action-btn edit-btn" title="Edit" onClick={() => openEditModal(s)}>
                        <img src={editIcon} alt="Edit" className="icon-16" />
                      </Button>
                      <Button variant="link" className="action-btn delete-btn" title="Delete" onClick={() => openDeleteModal(s)}>
                        <img src={deleteIcon} alt="Delete" className="icon-16" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center">No special categories found</td></tr>
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
              <Modal.Title>{isEditing ? 'Edit Special Category' : 'Add Special Category'}</Modal.Title>
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
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formCode" className="form-group">
                      <Form.Label className="form-label">Code <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" name="code" value={formData.code} onChange={handleInputChange} className="form-control-custom" placeholder="Enter code (e.g. PWD)" aria-invalid={!!errors.code} aria-describedby="codeError" />
                      <ErrorMessage id="codeError">{errors.code}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formName" className="form-group">
                      <Form.Label className="form-label">Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control-custom" placeholder="Enter name" aria-invalid={!!errors.name} aria-describedby="nameError" />
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
                    <p className="text-center small">Support for CSV and XLSX formats (CSV headers: code,name,description)</p>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <div>
                      <input id="upload-csv-special" type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => setSelectedCSVFile(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-csv-special">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload CSV</Button>
                      </label>
                    </div>

                    <div>
                      <input id="upload-xlsx-special" type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={(e) => setSelectedXLSXFile(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-xlsx-special">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload XLSX</Button>
                      </label>
                    </div>
                                        <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
                                        <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />
                    
                  </div>

                  <div className="text-center mt-4 small">
                    Download template:&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate('csv')} className='btnfont'>CSV</Button>
                    &nbsp;|&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate('xlsx')} className='btnfont'>XLSX</Button>
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

        {/* Delete Confirm */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered dialogClassName="delete-confirm-modal" container={typeof document !== 'undefined' ? document.body : undefined}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this special category?</p>
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

export default SpecialCategory;
