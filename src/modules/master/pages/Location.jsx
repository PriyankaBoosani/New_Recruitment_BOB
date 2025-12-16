// src/pages/Location.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import '../../../style/css/user.css';
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import editIcon from "../../../assets/edit_icon.png";
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { ValidateForm } from '../../../shared/utils/common-validations';

// Shared upload utilities (FileMeta, downloadTemplate, importLocations)
import { FileMeta, downloadTemplate, importFromCSV } from '../../../shared/components/FileUpload';
const Location = () => {
  // sample cities (you can fetch this from API later)
  const cityOptions = [
    { id: 1, name: 'Bengaluru' },
    { id: 2, name: 'Mumbai' },
    { id: 3, name: 'Delhi' },
    { id: 4, name: 'Hyderabad' },
    { id: 5, name: 'Chennai' },
  ];

  const [locations, setLocations] = useState([
    { id: 1, cityId: 1, cityName: 'Bengaluru', name: 'Whitefield' },
    { id: 2, cityId: 1, cityName: 'Bengaluru', name: 'Electronic City' },
    { id: 3, cityId: 2, cityName: 'Mumbai', name: 'Andheri' },
    { id: 4, cityId: 3, cityName: 'Delhi', name: 'Connaught Place' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [activeTab, setActiveTab] = useState('manual'); // manual | import
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  const [formData, setFormData] = useState({
    cityId: '',
    name: ''
  });

  const [errors, setErrors] = useState({});

  // Import wrapper — calls the shared importLocations (simple append)
  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: locations,
      setList: setLocations,
      mapRow: (row) => {
        // accept various header names
        const get = (r, ...keys) => {
          for (const k of keys) {
            if (Object.prototype.hasOwnProperty.call(r, k) && String(r[k] ?? '').trim() !== '') return String(r[k]).trim();
          }
          return '';
        };
        const cityRaw = get(row, 'city', 'cityname', 'city_name', 'town');
        const locationRaw = get(row, 'location', 'name', 'loc', 'location_name');
        return {
          cityId: null,
          cityName: cityRaw,
          name: locationRaw || 'Unnamed Location'
        };
      },
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab
    });
  };

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
    setEditingLocationId(null);
    setFormData({ cityId: '', name: '' });
    setErrors({});
    setActiveTab('manual');
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };

  const openEditModal = (loc) => {
    setIsEditing(true);
    setEditingLocationId(loc.id);
    setFormData({
      cityId: loc.cityId || '',
      name: loc.name || ''
    });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = (e) => {
  e.preventDefault();
  setErrors({});

  // validate using common validation function
  const { valid, errors: vErrors } = ValidateForm(formData, {
    existing: locations,
    currentId: isEditing ? editingLocationId : null
  });

  if (!valid) {
    setErrors(vErrors);
    return;
  }

  // normalization and save (same as before)
  const trimmedName = String(formData.name || '').trim();
  const cityId = formData.cityId ? Number(formData.cityId) : null;
  const cityName = cityId ? (cityOptions.find(c => c.id === cityId) || {}).name : (formData.cityName || '');

  if (isEditing) {
    setLocations(prev =>
      prev.map(loc =>
        loc.id === editingLocationId ? { ...loc, name: trimmedName, cityId, cityName } : loc
      )
    );
  } else {
    const newLoc = {
      id: Math.max(0, ...locations.map(d => d.id)) + 1,
      cityId,
      cityName,
      name: trimmedName
    };
    setLocations(prev => [...prev, newLoc]);
  }

  setShowAddModal(false);
};


  const openDeleteModal = (loc) => {
    setDeleteTarget({ id: loc.id, name: loc.name });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setLocations(prev => prev.filter(loc => loc.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Filter & pagination
  const filtered = locations.filter(loc =>
    [loc.name, loc.cityName].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
          <h2>Locations</h2>
          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by City or Location"
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
                <th>City Name</th>
                <th>Location Name</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.length > 0 ? (
                current.map((loc, idx) => (
                  <tr key={loc.id}>
                    <td>{indexOfFirst + idx + 1}</td>
                    <td data-label="City Name:">&nbsp;{loc.cityName}</td>
                    <td data-label="Location Name:">&nbsp;{loc.name}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="link" className="action-btn view-btn" title="View">
                          <img src={viewIcon} alt="View" className="icon-16" />
                        </Button>
                        <Button variant="link" className="action-btn edit-btn" title="Edit" onClick={() => openEditModal(loc)}>
                          <img src={editIcon} alt="Edit" className="icon-16" />
                        </Button>
                        <Button variant="link" className="action-btn delete-btn" title="Delete" onClick={() => openDeleteModal(loc)}>
                          <img src={deleteIcon} alt="Delete" className="icon-16" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No locations found</td>
                </tr>
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
          onHide={() => { setShowAddModal(false); setIsEditing(false); setEditingLocationId(null); }}
          size="lg"
          centered
          className="user-modal"
          fullscreen="sm-down"
          scrollable
        >
          <Modal.Header closeButton className="modal-header-custom">
            <div>
              <Modal.Title>{isEditing ? 'Edit Location' : 'Add Location'}</Modal.Title>
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
              <Form onSubmit={handleSave}>
                <Row className="g-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formCity" className="form-group">
                      <Form.Label className="form-label">City Name <span className="text-danger">*</span></Form.Label>
                      <Form.Select name="cityId" value={formData.cityId} onChange={handleInputChange} className="form-control-custom">
                        <option value="">Select city</option>
                        {cityOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </Form.Select>
                      <ErrorMessage>{errors.cityId}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formLocationName" className="form-group">
                      <Form.Label className="form-label">Location Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        placeholder="Enter location name"
                      />
                      <ErrorMessage>{errors.name}</ErrorMessage>
                    </Form.Group>
                  </Col>
                </Row>

                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingLocationId(null); }}>Cancel</Button>
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
                    <p className="text-muted small">Support for CSV and XLSX formats (CSV headers: city,location)</p>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <div>
                      <input id="upload-csv" type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => setSelectedCSVFile(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-csv">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload CSV</Button>
                      </label>
                    </div>

                    <div>
                      <input id="upload-xlsx" type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: 'none' }} onChange={(e) => setSelectedXLSXFile(e.target.files[0] ?? null)} />
                      <label htmlFor="upload-xlsx">
                        <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload XLSX</Button>
                      </label>
                    </div>

                    {/* show selected files */}
                    <FileMeta file={selectedCSVFile} onRemove={() => setSelectedCSVFile(null)} />
                    <FileMeta file={selectedXLSXFile} onRemove={() => setSelectedXLSXFile(null)} />
                  </div>

                  <div className="text-center mt-4 small">
                    Download template:&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate(['city', 'location'], ['Bengaluru', 'Whitefield'], 'locations-template')} className="btnfont">CSV</Button>
                    &nbsp;|&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate(['city', 'location'], ['Bengaluru', 'Whitefield'], 'locations-template')} className="btnfont">XLSX</Button>
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
            <p>Are you sure you want to delete this location?</p>
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

export default Location;
