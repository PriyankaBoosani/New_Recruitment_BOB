// src/pages/Documents.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { validateDocumentForm } from '../validators/document-validations';
import '../css/user.css';
import viewIcon from "../assets/view_icon.png";
import deleteIcon from "../assets/delete_icon.png";
import editIcon from "../assets/edit_icon.png";
import ErrorMessage from '../components/ErrorMessage';

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

  // CSV -> documents parser (simple, expects comma separated, headers: name,description)
  const parseCSVToDocuments = (text) => {
    const lines = text.split(/\r\n|\n/).map(l => l.trim()).filter(l => l !== '');
    if (lines.length < 2) return [];

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = lines.slice(1);

    return rows.map(row => {
      const cols = row.split(',').map(c => c.trim());
      const obj = {};
      header.forEach((h, i) => { obj[h] = cols[i] ?? ''; });

      return {
        name: obj.name || obj.documentname || '',
        description: obj.description || ''
      };
    });
  };

  const downloadTemplate = (type) => {
    const headers = ['name', 'description'];
    const sample = ['Aadhar Card', 'Proof of identity'];
    const csvContent = [headers.join(','), sample.join(',')].join('\n');

    let blob, filename;
    if (type === 'csv') {
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      filename = 'documents-template.csv';
    } else {
      blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      filename = 'documents-template.xlsx';
    }

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = async () => {
    if (!selectedCSVFile && !selectedXLSXFile) {
      alert('Please select a CSV or XLSX file to import.');
      return;
    }

    if (selectedCSVFile) {
      try {
        const text = await selectedCSVFile.text();
        const parsed = parseCSVToDocuments(text);

        const nextIdStart = Math.max(0, ...documents.map(d => d.id)) + 1;
        const newItems = [];
        let added = 0;

        for (let i = 0; i < parsed.length; i++) {
          const p = parsed[i];
          const payload = {
            name: String(p.name || '').trim(),
            description: String(p.description || '').trim()
          };

          const { valid } = validateDocumentForm(payload, { existing: documents.concat(newItems) });
          if (!valid) continue;

          newItems.push({ id: nextIdStart + newItems.length, ...payload });
          added++;
        }

        if (newItems.length > 0) setDocuments(prev => [...prev, ...newItems]);

        alert(`Imported ${added} document(s). Skipped ${parsed.length - added}.`);
        setSelectedCSVFile(null);
        setShowAddModal(false);
        setActiveTab('manual');
      } catch (err) {
        console.error(err);
        alert('Failed to read CSV file.');
      }
      return;
    }

    if (selectedXLSXFile) {
      alert('XLSX import selected. To parse XLSX files, install "xlsx" (SheetJS).');
      return;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => {
      const c = { ...prev }; if (c[name]) delete c[name]; return c;
    });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  const openEditModal = (d) => {
    setIsEditing(true);
    setEditingId(d.id);
    setFormData({ name: d.name || '', description: d.description || '' });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

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
                      <Form.Label className="form-label">Description</Form.Label>
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

                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <div>
                      <input id="upload-csv-doc" type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => setSelectedCSVFile(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-csv-doc">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload CSV</Button>
                      </label>
                    </div>

                    <div>
                      <input id="upload-xlsx-doc" type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={(e) => setSelectedXLSXFile(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-xlsx-doc">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload XLSX</Button>
                      </label>
                    </div>
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
