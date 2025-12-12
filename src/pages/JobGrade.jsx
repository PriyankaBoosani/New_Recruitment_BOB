// src/pages/JobGrade.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { ValidateForm } from '../validators/common-validations';
import '../css/user.css';
import viewIcon from "../assets/view_icon.png";
import deleteIcon from "../assets/delete_icon.png";
import editIcon from "../assets/edit_icon.png";
import ErrorMessage from '../components/ErrorMessage';
import { FileMeta, downloadTemplate, importFromCSV } from '../components/FileUpload';

const JobGrade = () => {
    const [jobGrades, setJobGrades] = useState([
        { id: 1, scale: 'Scale-I', gradeCode: 'JG1', minSalary: 45000, maxSalary: 60000, description: 'Entry level' },
        { id: 2, scale: 'Scale-II', gradeCode: 'JG2', minSalary: 55000, maxSalary: 70000, description: 'Junior level' },
        { id: 3, scale: 'Scale-III', gradeCode: 'JG3', minSalary: 65000, maxSalary: 90000, description: 'Mid level' },
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

    // Format number with commas (Indian)
    const formatNumber = (value) => {
        if (value === '' || value === null || value === undefined) return "";
        const num = String(value).replace(/,/g, "");
        if (num === '') return "";
        if (isNaN(num)) return value;
        return Number(num).toLocaleString("en-IN");
    };

    const [formData, setFormData] = useState({
        scale: '',
        gradeCode: '',
        minSalary: '',
        maxSalary: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    // sample scale options for the select (you can fetch from API)
    const scaleOptions = [
        'Scale-I', 'Scale-II', 'Scale-III', 'Scale-IV', 'Scale-V', 'Scale-VI', 'Scale-VII'
    ];

    // helpers for file selection (used by import UI)
    const onSelectCSV = (file) => setSelectedCSVFile(file ?? null);
    const onSelectXLSX = (file) => setSelectedXLSXFile(file ?? null);
    const removeCSV = () => setSelectedCSVFile(null);
    const removeXLSX = () => setSelectedXLSXFile(null);

    // replace your existing handleImport with importFromCSV wrapper
   const handleImport = async () => {
    await importFromCSV({
        selectedCSVFile,
        selectedXLSXFile,
        list: jobGrades,
        setList: setJobGrades,

        // simple mapping EXACTLY like Department.jsx
        mapRow: (row) => ({
            scale: (row.scale ?? row.grade_scale ?? row.scale_name ?? '').trim(),
            gradeCode: (row.gradeCode ?? row.grade_code ?? row.grade ?? row.code ?? '').trim(),
            minSalary: (row.minSalary ?? row.min_salary ?? row.min ?? row.minimum ?? '').trim(),
            maxSalary: (row.maxSalary ?? row.max_salary ?? row.max ?? row.maximum ?? '').trim(),
            description: (row.description ?? row.desc ?? row.details ?? '').trim(),
        }),

        // ❌ no validateRow (same as department)
        // validateRow: undefined,

        setSelectedCSVFile,
        setSelectedXLSXFile,
        setShowAddModal,
        setActiveTab
    });
};


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'gradeCode') {
            setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
            return;
        }

        // For salary fields → format with commas for display but keep raw number in state
        if (name === "minSalary" || name === "maxSalary") {
            const raw = String(value).replace(/,/g, "");
            if (!/^\d*$/.test(raw)) return; // block non-numeric
            setFormData(prev => ({ ...prev, [name]: raw }));
            // reflected formatted value is handled by value={formatNumber(...)} on the input
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ scale: '', gradeCode: '', minSalary: '', maxSalary: '', description: '' });
        setErrors({});
        setActiveTab('manual');
        setSelectedCSVFile(null);
        setSelectedXLSXFile(null);
        setShowAddModal(true);
    };

    const openEditModal = (g) => {
        setIsEditing(true);
        setEditingId(g.id);
        setFormData({
            scale: g.scale || '',
            gradeCode: g.gradeCode || '',
            minSalary: g.minSalary ?? '',
            maxSalary: g.maxSalary ?? '',
            description: g.description || ''
        });
        setErrors({});
        setActiveTab('manual');
        setShowAddModal(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            scale: String(formData.scale || '').trim(),
            gradeCode: String(formData.gradeCode || '').trim(),
            minSalary: formData.minSalary === '' ? '' : Number(formData.minSalary),
            maxSalary: formData.maxSalary === '' ? '' : Number(formData.maxSalary),
            description: String(formData.description || '').trim()
        };

        const { valid, errors: vErrors } = ValidateForm(payload, {
            existing: jobGrades,
            currentId: isEditing ? editingId : null
        });

        if (!valid) {
            setErrors(vErrors);
            return;
        }

        if (isEditing) {
            setJobGrades(prev => prev.map(j => j.id === editingId ? { ...j, ...payload } : j));
        } else {
            const newItem = { id: Math.max(0, ...jobGrades.map(d => d.id)) + 1, ...payload };
            setJobGrades(prev => [...prev, newItem]);
        }

        setShowAddModal(false);
    };

    const openDeleteModal = (g) => {
        setDeleteTarget({ id: g.id, name: g.scale });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setJobGrades(prev => prev.filter(j => j.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    // Filtering & pagination
    const filtered = jobGrades.filter(j =>
        [j.scale, j.gradeCode, j.description, String(j.minSalary), String(j.maxSalary)]
            .some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
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
                    <h2>Job Grades</h2>
                    <div className="user-actions">
                        <div className="search-box">
                            <Search className="search-icon" />
                            <Form.Control
                                type="text"
                                placeholder="Search by scale, code, salary or description"
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
                                <th>Scale</th>
                                <th>Grade Code</th>
                                <th>Minimum Salary</th>
                                <th>Maximum Salary</th>
                                <th>Description</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.length > 0 ? (
                                current.map((g, idx) => (
                                    <tr key={g.id}>
                                        <td>{indexOfFirst + idx + 1}</td>
                                        <td data-label="Scale: ">&nbsp;{g.scale}</td>
                                        <td data-label="Grade Code: ">&nbsp;{g.gradeCode}</td>
                                        <td data-label="Min Salary: ">&nbsp;{g.minSalary === '' ? '' : formatNumber(g.minSalary)}</td>
                                        <td data-label="Max Salary: ">&nbsp;{g.maxSalary === '' ? '' : formatNumber(g.maxSalary)}</td>
                                        <td data-label="Description: ">&nbsp;{g.description}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button variant="link" className="action-btn view-btn" title="View">
                                                    <img src={viewIcon} alt="View" className="icon-16" />
                                                </Button>
                                                <Button variant="link" className="action-btn edit-btn" title="Edit" onClick={() => openEditModal(g)}>
                                                    <img src={editIcon} alt="Edit" className="icon-16" />
                                                </Button>
                                                <Button variant="link" className="action-btn delete-btn" title="Delete" onClick={() => openDeleteModal(g)}>
                                                    <img src={deleteIcon} alt="Delete" className="icon-16" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No job grades found</td>
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

                {/* Add / Edit Modal */}
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
                            <Modal.Title>{isEditing ? 'Edit Grade' : 'Add Grade'}</Modal.Title>
                            <p className="mb-0 small text-muted para">Choose to add manually or import from CSV/XLSX file</p>
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
                                        <Form.Group controlId="formScale" className="form-group">
                                            <Form.Label className="form-label">Scale <span className="text-danger">*</span></Form.Label>
                                            <Form.Select name="scale" value={formData.scale} onChange={handleInputChange} className="form-control-custom">
                                                <option value="">Select Scale</option>
                                                {scaleOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                            </Form.Select>
                                            <ErrorMessage>{errors.scale}</ErrorMessage>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="formGradeCode" className="form-group">
                                            <Form.Label className="form-label">Grade Code <span className="text-danger">*</span></Form.Label>
                                            <Form.Control type="text" name="gradeCode" value={formData.gradeCode} onChange={handleInputChange} className="form-control-custom" placeholder="Enter Grade Code" />
                                            <ErrorMessage>{errors.gradeCode}</ErrorMessage>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="formMinSalary" className="form-group">
                                            <Form.Label className="form-label">Min Salary <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="minSalary"
                                                value={formatNumber(formData.minSalary)}
                                                onChange={handleInputChange}
                                                className="form-control-custom"
                                                placeholder="Enter Min Salary"
                                            />
                                            <ErrorMessage>{errors.minSalary}</ErrorMessage>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="formMaxSalary" className="form-group">
                                            <Form.Label className="form-label">Max Salary <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="maxSalary"
                                                value={formatNumber(formData.maxSalary)}
                                                onChange={handleInputChange}
                                                className="form-control-custom"
                                                placeholder="Enter Max Salary"
                                            />
                                            <ErrorMessage>{errors.maxSalary}</ErrorMessage>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>
                                        <Form.Group controlId="formDescription" className="form-group">
                                            <Form.Label className="form-label">Description <span className="text-danger">*</span></Form.Label>
                                            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} className="form-control-custom" placeholder="Add Description here ..." />
                                            <ErrorMessage>{errors.description}</ErrorMessage>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                                    <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingId(null); }}>Cancel</Button>
                                    <Button variant="primary" type="submit">Save</Button>
                                </Modal.Footer>
                            </Form>
                        ) : (
                            <>
                                <div className="import-area p-4 rounded">
                                    <div className="text-center mb-3">
                                        <div style={{ width: 72, height: 72, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', marginBottom: '1rem' }}>
                                            <Upload size={32} />
                                        </div>
                                        <h5 className="mb-2 uploadfile">Upload File</h5>
                                        <p className="text-muted small">Support for CSV and XLSX formats (CSV headers: scale,gradeCode,minSalary,maxSalary,description)</p>
                                    </div>

                                    <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                                        <div>
                                            <input id="upload-csv" type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => onSelectCSV(e.target.files[0] ?? null)} />
                                            <label htmlFor="upload-csv">
                                                <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload CSV</Button>
                                            </label>
                                        </div>

                                        <div>
                                            <input id="upload-xlsx" type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: 'none' }} onChange={(e) => onSelectXLSX(e.target.files[0] ?? null)} />
                                            <label htmlFor="upload-xlsx">
                                                <Button variant="light" as="span" className='btnfont'><i className="bi bi-upload me-1"></i> Upload XLSX</Button>
                                            </label>
                                        </div>

                                        <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
                                        <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />
                                    </div>

                                    <div className="text-center mt-4 small">
                                        Download template:&nbsp;
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                downloadTemplate(
                                                    ['scale', 'gradeCode', 'minSalary', 'maxSalary', 'description'],
                                                    ['Scale-I', 'JG1', '45000', '60000', 'Entry level'],
                                                    'jobgrades-template'
                                                )
                                            }
                                            className="btnfont"
                                        >
                                            CSV
                                        </Button>
                                        &nbsp;|&nbsp;
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                downloadTemplate(
                                                    ['scale', 'gradeCode', 'minSalary', 'maxSalary', 'description'],
                                                    ['Scale-I', 'JG1', '45000', '60000', 'Entry level'],
                                                    'jobgrades-template'
                                                )
                                            }
                                            className="btnfont"
                                        >
                                            XLSX
                                        </Button>
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
                        <p>Are you sure you want to delete this job grade?</p>
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

export default JobGrade;
