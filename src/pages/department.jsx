// src/pages/Department.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal, Badge } from 'react-bootstrap';
import { Search, Plus, Upload, X as XIcon } from 'react-bootstrap-icons';
import { validateDepartmentForm } from '../validators/department-validations';
import '../css/user.css';
import viewIcon from "../assets/view_icon.png";
import deleteIcon from "../assets/delete_icon.png";
import editIcon from "../assets/edit_icon.png";
import ErrorMessage from '../components/ErrorMessage';

const humanFileSize = (size) => {
    if (!size && size !== 0) return '';
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    return `${(size / Math.pow(1024, i)).toFixed((i === 0) ? 0 : (i < 2 ? 1 : 2))} ${sizes[i]}`;
};

const FileMeta = ({ file, onRemove }) => {
    if (!file) return null;
    return (
        <div className="mt-2 d-flex align-items-center gap-2 file-meta">
            <Badge bg="success" pill style={{ fontSize: 12, padding: '6px 8px' }}>✓</Badge>
            <div style={{ fontSize: 13 }}>
                <strong style={{ display: 'block' }}>{file.name}</strong>
                <small className="text-muted">{humanFileSize(file.size)}</small>
            </div>
            <Button variant="outline-secondary" size="sm" className="ms-auto" onClick={onRemove} title="Remove selected file">
                <XIcon size={14} />
            </Button>
        </div>
    );
};

const Department = () => {
    // Sample department data
    const [departments, setDepartments] = useState([
        { id: 1, name: 'Information Technology', description: 'Handles all IT related operations and infrastructure' },
        { id: 2, name: 'Human Resources', description: 'Manages employee relations, recruitment, and HR policies' },
        { id: 3, name: 'Finance', description: 'Oversees financial planning, accounting, and investments' },
        { id: 4, name: 'Marketing', description: 'Responsible for brand management and marketing strategies' },
        { id: 5, name: 'Operations', description: 'Manages daily business operations and processes' },
        { id: 6, name: 'Market Risk', description: 'Market Risk monitors and controls risks arising from changes in interest rates, exchange rates, equity prices, and other market variables.' },
        { id: 7, name: 'Integrated Risk Management', description: 'Integrated Risk Management oversees enterprise-wide risks by combining credit, market, operational, and strategic risk frameworks to ensure regulatory compliance and business continuity.' },
        { id: 8, name: 'Employee Relations', description: 'Employee Relations handles workplace policies, conflict resolution, disciplinary actions, and employee engagement initiatives to maintain a positive work environment' },
        { id: 9, name: 'Performance Management', description: 'This department manages goal setting, performance evaluations, competency mapping, and career development planning to ensure employee productivity' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingDeptId, setEditingDeptId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'import'
    const [selectedCSVFile, setSelectedCSVFile] = useState(null);
    const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    const downloadTemplate = (type) => {
        const headers = ['name', 'description'];
        const sample = ['Information Technology', 'Handles all IT related operations and infrastructure'];
        const csvContent = [headers.join(','), sample.join(',')].join('\n');

        let blob, filename;
        if (type === 'csv') {
            blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            filename = 'departments-template.csv';
        } else {
            blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            filename = 'departments-template.xlsx';
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

    const parseCSVTextToDepartments = (text) => {
        const lines = text.split(/\r\n|\n/).map(l => l.trim()).filter(l => l !== '');
        if (lines.length < 2) return [];

        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        const rows = lines.slice(1);

        return rows.map(row => {
            const cols = row.split(',').map(c => c.trim());
            const item = {};
            header.forEach((h, idx) => { item[h] = cols[idx] ?? ''; });
            return {
                name: item.name || 'Unnamed Department',
                description: item.description || ''
            };
        });
    };

    const handleImport = async () => {
        if (!selectedCSVFile && !selectedXLSXFile) {
            alert('Please select a CSV or XLSX file to import.');
            return;
        }

        if (selectedCSVFile) {
            try {
                const text = await selectedCSVFile.text();
                const parsed = parseCSVTextToDepartments(text);

                const nextIdStart = Math.max(0, ...departments.map(d => d.id)) + 1;
                const newDepartments = parsed.map((p, i) => ({
                    id: nextIdStart + i,
                    name: p.name,
                    description: p.description
                }));

                if (newDepartments.length === 0) {
                    alert('No valid rows found in CSV.');
                } else {
                    setDepartments(prev => [...prev, ...newDepartments]);
                    alert(`Imported ${newDepartments.length} departments from CSV.`);
                    setSelectedCSVFile(null);
                    setShowAddModal(false);
                    setActiveTab('manual');
                }
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

    // small helpers to show and clear selected files
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
        setEditingDeptId(null);
        setFormData({
            name: '',
            description: ''
        });
        setErrors({});
        setActiveTab('manual');
        setSelectedCSVFile(null);
        setSelectedXLSXFile(null);
        setShowAddModal(true);
    };

    // Open modal for Edit (populate form)
    const openEditModal = (dept) => {
        setIsEditing(true);
        setEditingDeptId(dept.id);
        setFormData({
            name: dept.name,
            description: dept.description || ''
        });
        setErrors({});
        setActiveTab('manual');
        setShowAddModal(true);
    };

    // Save handler (both add & update) using validator
    const handleSave = (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate form with current department ID for edit operations
        const { valid, errors: vErrors } = validateDepartmentForm(formData, {
            existing: departments,                      // pass current list for uniqueness check
            currentId: isEditing ? editingDeptId : null
        });

        if (!valid) {
            setErrors(vErrors);
            return;
        }

        // Clear errors if validation passes
        setErrors({});

        if (isEditing) {
            setDepartments(prev =>
                prev.map(dept =>
                    dept.id === editingDeptId
                        ? { ...dept, ...formData }
                        : dept
                )
            );
        } else {
            const newDept = {
                id: Math.max(0, ...departments.map(d => d.id)) + 1,
                ...formData
            };
            setDepartments(prev => [...prev, newDept]);
        }

        // Reset form & modal state
        setShowAddModal(false);
        setIsEditing(false);
        setEditingDeptId(null);
        setFormData({
            name: '',
            description: ''
        });
    };

    // Delete confirmation state & handlers
    const openDeleteModal = (dept) => {
        setDeleteTarget({ id: dept.id, name: dept.name });
        setShowDeleteModal(true);
    };
    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDepartments(prev => prev.filter(u => u.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    // Pagination & filtering
    const filteredDepts = departments.filter(dept =>
        Object.values(dept).some(v => v.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const indexOfLastDept = currentPage * itemsPerPage;
    const indexOfFirstDept = indexOfLastDept - itemsPerPage;
    const currentDepts = filteredDepts.slice(indexOfFirstDept, indexOfLastDept);
    const totalPages = Math.ceil(filteredDepts.length / itemsPerPage);
    const paginate = (num) => setCurrentPage(num);

    return (
        <Container fluid className="user-container">
            <div className="user-content">
                <div className="user-header">
                    <h2>Departments</h2>
                    <div className="user-actions">
                        <div className="search-box">
                            <Search className="search-icon" />
                            <Form.Control
                                type="text"
                                placeholder="Search by Department"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="search-input"
                            />
                        </div>

                        <Button
                            variant="primary"
                            className="add-button"
                            onClick={openAddModal}
                        >
                            <Plus size={20} className="me-1" /> Add
                        </Button>
                    </div>
                </div>

                <div className="table-responsive">
                    <Table hover className="user-table">
                        <thead>
                            <tr>
                                <th>S. No.</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th style={{ textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDepts.length > 0 ? (
                                currentDepts.map((dept, idx) => (
                                    <tr key={dept.id}>
                                        <td>{indexOfFirstDept + idx + 1}</td>
                                        <td data-label="Name:">&nbsp;{dept.name}</td>
                                        <td data-label="Description:">&nbsp;{dept.description}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button variant="link" className="action-btn view-btn" title="View">
                                                    <img src={viewIcon} alt="View" className="icon-16" />
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className="action-btn edit-btn"
                                                    title="Edit"
                                                    onClick={() => openEditModal(dept)}
                                                >
                                                    <img src={editIcon} alt="Edit" className='icon-16' />
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className="action-btn delete-btn"
                                                    title="Delete"
                                                    onClick={() => openDeleteModal(dept)}
                                                >
                                                    <img src={deleteIcon} alt="Delete" className='icon-16' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No departments found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {filteredDepts.length > 0 && (
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
                    onHide={() => {
                        setShowAddModal(false);
                        setIsEditing(false);
                        setEditingDeptId(null);
                    }}
                    size="lg"
                    centered
                    className="user-modal"
                    fullscreen="sm-down"
                    scrollable
                >
                    <Modal.Header closeButton className="modal-header-custom">
                        <div>
                            <Modal.Title>{isEditing ? 'Edit Department' : 'Add Department'}</Modal.Title>
                            <p className="mb-0 small text-muted para">Choose to add manually or import from CSV/XLSX file.</p>
                        </div>
                    </Modal.Header>

                    <Modal.Body className="p-4">
                        {!isEditing && (
                            <div className="tab-buttons mb-4">
                                <Button
                                    variant={activeTab === 'manual' ? 'light' : 'outline-light'}
                                    className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('manual')}
                                >
                                    Manual Entry
                                </Button>
                                <Button
                                    variant={activeTab === 'import' ? 'light' : 'outline-light'}
                                    className={`tab-button ${activeTab === 'import' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('import')}
                                >
                                    Import File
                                </Button>
                            </div>
                        )}

                        {activeTab === 'manual' ? (
                            <Form onSubmit={handleSave}>
                                <Row className="g-3">
                                    <Col xs={12} md={12}>
                                        <Form.Group controlId="formName" className="form-group">
                                            <Form.Label className="form-label">Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="form-control-custom"
                                                placeholder="Enter department name"
                                            />
                                            <ErrorMessage>{errors.name}</ErrorMessage>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>
                                        <Form.Group controlId="formDescription" className="form-group">
                                            <Form.Label className="form-label">Description <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="form-control-custom"
                                                placeholder="Enter department description"
                                            />
                                            <ErrorMessage>{errors.description}</ErrorMessage>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                                    <Button variant="outline-secondary" onClick={() => {
                                        setShowAddModal(false);
                                        setIsEditing(false);
                                        setEditingDeptId(null);
                                    }}>Cancel</Button>
                                    <Button variant="primary" type="submit">{isEditing ? 'Update' : 'Save'}</Button>
                                </Modal.Footer>
                            </Form>
                        ) : (
                            <>
                                <div className="import-area p-4 rounded" style={{ background: '#fceee9' }}>
                                    <div className="text-center mb-3">
                                        <div style={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 12,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#fff',
                                            marginBottom: '1rem'
                                        }}>
                                            <Upload size={32} />
                                        </div>
                                        <h5 className="mb-2 uploadfile">Upload File</h5>
                                        <p className="text-muted small">Support for CSV and XLSX formats</p>
                                    </div>

                                    <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                                        <div>
                                            <input
                                                id="upload-csv"
                                                type="file"
                                                accept=".csv,text/csv"
                                                style={{ display: 'none' }}
                                                onChange={(e) => onSelectCSV(e.target.files[0] ?? null)}
                                            />
                                            <label htmlFor="upload-csv">
                                                <Button variant="light" as="span" className='btnfont'>
                                                    <i className="bi bi-upload me-1"></i> Upload CSV
                                                </Button>
                                            </label>

                                            {/* show selected CSV file metadata */}

                                        </div>

                                        <div>
                                            <input
                                                id="upload-xlsx"
                                                type="file"
                                                accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                style={{ display: 'none' }}
                                                onChange={(e) => onSelectXLSX(e.target.files[0] ?? null)}
                                            />
                                            <label htmlFor="upload-xlsx">
                                                <Button variant="light" as="span" className='btnfont'>
                                                    <i className="bi bi-upload me-1"></i> Upload XLSX
                                                </Button>
                                            </label>

                                            {/* show selected XLSX file metadata */}
                                        </div>
                                        <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
                                        <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />

                                    </div>

                                    <div className="text-center mt-4 small">
                                        Download template:&nbsp;
                                        <Button variant="link" className='btnfont' onClick={() => downloadTemplate('csv')} >CSV</Button>
                                        &nbsp;|&nbsp;
                                        <Button variant="link" className='btnfont' onClick={() => downloadTemplate('xlsx')} >XLSX</Button>
                                    </div>
                                </div>

                                <Modal.Footer className="modal-footer-custom px-0">
                                    <Button variant="outline-secondary" onClick={() => {
                                        setShowAddModal(false);
                                        setActiveTab('manual');
                                    }}>Cancel</Button>
                                    <Button variant="primary" onClick={handleImport}>Import</Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal.Body>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    show={showDeleteModal}
                    onHide={cancelDelete}
                    centered
                    dialogClassName="delete-confirm-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this department?</p>
                        {deleteTarget && (
                            <div className="delete-confirm-user">
                                <strong>{deleteTarget.name}</strong>
                            </div>
                        )}
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

export default Department;
