// src/pages/InterviewPanel.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { validateInterviewPanelForm } from '../validators/interviewpanel-validations';
import '../css/user.css';
import viewIcon from "../assets/view_icon.png";
import deleteIcon from "../assets/delete_icon.png";
import editIcon from "../assets/edit_icon.png";
import ErrorMessage from '../components/ErrorMessage';

const InterviewPanel = () => {
  const [panels, setPanels] = useState([
    { id: 1, name: 'Application Screening Panel', members: 'Harsha Tatapudi, Manaswi Puttamarju' },
    { id: 2, name: 'Document Verification Panel', members: 'Mahesh Allvar, Sumanth Sangam, Vamshi Vaddempudi' },
    { id: 3, name: 'Eligibility Screening Committee', members: 'Aftab Khan, Sathvik Pothumanchi' },
    { id: 4, name: 'Shortlisting Panel', members: 'Veeresh Vadlamani, Barat Thumma' },
    { id: 5, name: 'Pre-Screening Evaluation Team', members: 'Sarish Jindham, Naresh Palarapu, Vijay Villuri' },
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

  const [formData, setFormData] = useState({ name: '', members: '' });
  const [errors, setErrors] = useState({});

  // CSV parser
  const parseCSV = (text) => {
    const lines = text.split(/\r\n|\n/).map(l => l.trim()).filter(l => l !== '');
    if (lines.length < 2) return [];

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = lines.slice(1);

    return rows.map(row => {
      const cols = row.split(',').map(c => c.trim());
      const obj = {};
      header.forEach((h, i) => obj[h] = cols[i] ?? '');

      return {
        name: obj.name || '',
        members: obj.members || ''
      };
    });
  };

  const downloadTemplate = (type) => {
    const headers = ['name', 'members'];
    const sample = ['Application Screening Panel', 'John Doe, Sarah Wilson'];
    const csv = [headers.join(','), sample.join(',')].join('\n');

    let blob, filename;
    if (type === 'csv') {
      blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      filename = 'interviewpanels-template.csv';
    } else {
      blob = new Blob([csv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      filename = 'interviewpanels-template.xlsx';
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImport = async () => {
    if (!selectedCSVFile && !selectedXLSXFile) {
      alert("Please upload CSV/XLSX file");
      return;
    }

    if (selectedCSVFile) {
      const text = await selectedCSVFile.text();
      const parsed = parseCSV(text);

      const nextId = Math.max(...panels.map(p => p.id), 0) + 1;

      const newItems = [];
      let added = 0;

      for (const p of parsed) {
        const payload = { name: p.name.trim(), members: p.members.trim() };

        const { valid } = validateInterviewPanelForm(payload, {
          existing: panels.concat(newItems)
        });

        if (!valid) continue;

        newItems.push({
          id: nextId + newItems.length,
          ...payload
        });

        added++;
      }

      if (added > 0) setPanels(prev => [...prev, ...newItems]);

      alert(`Imported ${added} panel(s).`);
      setShowAddModal(false);
      setActiveTab('manual');
      return;
    }

    alert("Install SheetJS to parse XLSX files.");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setErrors(prev => { const x = { ...prev }; delete x[name]; return x; });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', members: '' });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const openEdit = (p) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormData({ name: p.name, members: p.members });
    setErrors({});
    setShowAddModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name: formData.name.trim(),
      members: formData.members.trim()
    };

    const { valid, errors: vErr } = validateInterviewPanelForm(payload, {
      existing: panels,
      currentId: isEditing ? editingId : null
    });

    if (!valid) {
      setErrors(vErr);
      return;
    }

    if (isEditing) {
      setPanels(prev => prev.map(p => p.id === editingId ? { ...p, ...payload } : p));
    } else {
      setPanels(prev => [
        ...prev,
        { id: Math.max(...panels.map(p => p.id), 0) + 1, ...payload }
      ]);
    }

    setShowAddModal(false);
  };

  const filtered = panels.filter(p =>
    [p.name, p.members].some(v =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h2>Interview Panels</h2>

          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
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
                      <Button variant="link" className="action-btn view-btn"><img src={viewIcon} className="icon-16" /></Button>
                      <Button variant="link" className="action-btn edit-btn" onClick={() => openEdit(p)}><img src={editIcon} className="icon-16" /></Button>
                      <Button variant="link" className="action-btn delete-btn" onClick={() => { setDeleteTarget(p); setShowDeleteModal(true); }}><img src={deleteIcon} className="icon-16" /></Button>
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
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <li key={n} className={`page-item ${n === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(n)}>{n}</button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered fullscreen="sm-down" scrollable className="user-modal">
          <Modal.Header closeButton className="modal-header-custom">
            <div>
              <Modal.Title>{isEditing ? "Edit Panel" : "Add Panel"}</Modal.Title>
              <p className="small text-muted para">Choose to add manually or import from CSV/XLSX file.</p>
            </div>
          </Modal.Header>

          <Modal.Body className="p-4">
            {!isEditing && (
              <div className="tab-buttons mb-4">
                <Button variant={activeTab === "manual" ? "light" : "outline-light"} className={`tab-button ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>Manual Entry</Button>
                <Button variant={activeTab === "import" ? "light" : "outline-light"} className={`tab-button ${activeTab === "import" ? "active" : ""}`} onClick={() => setActiveTab("import")}>Import File</Button>
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
                      <Form.Control as="textarea" rows={3} name="members" value={formData.members} onChange={handleInput} placeholder="Enter comma separated members" className="form-control-custom" />
                      <ErrorMessage>{errors.members}</ErrorMessage>
                    </Form.Group>
                  </Col>
                </Row>

                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                  <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
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

                  <div className="d-flex justify-content-center gap-3">
                    <div>
                      <input id="panel-csv" type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => setSelectedCSVFile(e.target.files[0])} />
                      <label htmlFor="panel-csv">
                        <Button variant="light" as="span">Upload CSV</Button>
                      </label>
                    </div>

                    <div>
                      <input id="panel-xlsx" type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={(e) => setSelectedXLSXFile(e.target.files[0])} />
                      <label htmlFor="panel-xlsx">
                        <Button variant="light" as="span">Upload XLSX</Button>
                      </label>
                    </div>
                  </div>

                  <div className="text-center mt-4 small">
                    Download template:&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate('csv')}>CSV</Button>
                    &nbsp;|&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate('xlsx')}>XLSX</Button>
                  </div>
                </div>

                <Modal.Footer className="modal-footer-custom px-0">
                  <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleImport}>Import</Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Body>
        </Modal>

        {/* Delete confirmation */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered dialogClassName="delete-confirm-modal">
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this panel?</p>
            {deleteTarget && <strong>{deleteTarget.name}</strong>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setPanels(prev => prev.filter(p => p.id !== deleteTarget.id)); setShowDeleteModal(false); }}>Delete</Button>
          </Modal.Footer>
        </Modal>

      </div>
    </Container>
  );
};

export default InterviewPanel;
