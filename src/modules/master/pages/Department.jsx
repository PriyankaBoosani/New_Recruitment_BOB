// src/pages/Department.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { ValidateDepartment } from '../../../shared/utils/common-validations';
import '../../../style/css/user.css';
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import editIcon from "../../../assets/edit_icon.png";
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { FileMeta, downloadTemplate, importFromCSV } from '../../../shared/components/FileUpload';
import { useTranslation } from "react-i18next";
import masterApiService from '../services/masterApiService';
import { mapDepartmentFromApi, mapDepartmentToApi } from "../mappers/departmentMapper";
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Department = () => {
    const { t } = useTranslation(["department", "validation"]);
    const [departments, setDepartments] = useState([]);
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

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await masterApiService.getAllDepartments();

            console.log("RAW API RESPONSE 👉", res.data);

            if (Array.isArray(res.data)) {
                const mapped = res.data.map(mapDepartmentFromApi);
                setDepartments(mapped);
            } else {
                setDepartments([]);
            }
        } catch (err) {
            console.error("Failed to fetch departments", err);
            setDepartments([]);
        }
    };
    const handleImport = async () => {
        await importFromCSV({
            selectedCSVFile,
            selectedXLSXFile,
            list: departments,
            setList: setDepartments,
            // map CSV parsed row -> department (matches your old mapping)
            mapRow: (row) => ({
                name: (row.name ?? row.department ?? row['dept_name'] ?? '').trim(),
                description: (row.description ?? row.desc ?? '').trim()
            }),
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

    const handleSave = async (e) => {
        e.preventDefault();

        setErrors({});
        const { valid, errors: vErrors } = ValidateDepartment(
            formData,
            departments,
            isEditing ? editingDeptId : null
        );

        if (!valid) {
            setErrors(vErrors);
            return;
        }

        try {
            if (!isEditing) {
                // 🔹 ADD
                const payload = mapDepartmentToApi(formData);
                await masterApiService.addDepartment(payload);
                await fetchDepartments(); // refresh table
                setShowAddModal(false);
                toast.success("Department added successfully");
            } else {
                // 🔹 UPDATE
                const payload = mapDepartmentToApi(formData);
                await masterApiService.updateDepartment(editingDeptId, payload);

                await fetchDepartments();
                toast.success("Department updated successfully");
                setShowAddModal(false);
                setIsEditing(false);
                setEditingDeptId(null);
            }

            setFormData({ name: '', description: '' });
        } catch (err) {
            console.error("Save failed", err);
        }
    };
    // Delete confirmation state & handlers
    const openDeleteModal = (dept) => {
        setDeleteTarget({ id: dept.id, name: dept.name });
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            await masterApiService.deleteDepartment(deleteTarget.id);

            await fetchDepartments(); // refresh list
            toast.success("Department deleted successfully");
            setShowDeleteModal(false);
            setDeleteTarget(null);
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    // Pagination & filtering
    const filteredDepts = departments.filter(dept =>
        Object.values(dept).some(v =>
            String(v ?? '')
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
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
                    <h2>{t("department:departments")}</h2>
                    <div className="user-actions">
                        <div className="search-box">
                            <Search className="search-icon" />
                            <Form.Control
                                type="text"
                                placeholder={t("search_by_department")}
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
                            <Plus size={20} className="me-1" /> {t("department:add")}
                        </Button>
                    </div>
                </div>

                <div className="table-responsive">
                    <Table hover className="user-table">
                        <thead>
                            <tr>
                                <th>{t("department:s.no.")}</th>
                                <th>{t("department:name")}</th>
                                <th>{t("department:description")}</th>
                                <th style={{ textAlign: "center" }}>{t("department:actions")}</th>
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
                            <Modal.Title>{isEditing ? t("editDepartment") : t("addDepartment")}</Modal.Title>
                            <p className="mb-0 small text-muted para">{t("choose_add_method")}</p>
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
                                    {t("manual_entry")}
                                </Button>
                                <Button
                                    variant={activeTab === 'import' ? 'light' : 'outline-light'}
                                    className={`tab-button ${activeTab === 'import' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('import')}
                                >
                                    {t("import_file")}
                                </Button>
                            </div>
                        )}

                        {activeTab === 'manual' ? (
                            <Form onSubmit={handleSave}>
                                <Row className="g-3">
                                    <Col xs={12} md={12}>
                                        <Form.Group controlId="formName" className="form-group">
                                            <Form.Label className="form-label">{t("name")} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="form-control-custom"
                                                placeholder={t("department:enterName")}
                                            />
                                            <ErrorMessage>{errors.name}</ErrorMessage>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>
                                        <Form.Group controlId="formDescription" className="form-group">
                                            <Form.Label className="form-label">{t("description")} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="form-control-custom"
                                                placeholder={t("department:enterDescription")} />
                                            <ErrorMessage>{errors.description}</ErrorMessage>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                                    <Button variant="outline-secondary" onClick={() => {
                                        setShowAddModal(false);
                                        setIsEditing(false);
                                        setEditingDeptId(null);
                                    }}>{t("cancel")}</Button>
                                    <Button variant="primary" type="submit">{isEditing ? t("updateDepartment") : t("save")}</Button>
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
                                        <h5 className="mb-2 uploadfile">{t("upload_file")}</h5>
                                        <p className="text-muted small">{t("support_csv_xlsx")}</p>
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
                                                    <i className="bi bi-upload me-1"></i> {t("upload_csv")}
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
                                                    <i className="bi bi-upload me-1"></i> {t("upload_xlsx")}
                                                </Button>
                                            </label>

                                            {/* show selected XLSX file metadata */}
                                        </div>
                                        <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
                                        <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />

                                    </div>

                                    <div className="text-center mt-4 small">
                                        {t("download_template")}:&nbsp;
                                        <Button
                                            variant="link"
                                            className='btnfont'
                                            onClick={() =>
                                                downloadTemplate(
                                                    ['name', 'description'],
                                                    ['Information Technology', 'Handles all IT related operations and infrastructure'],
                                                    'departments-template',
                                                    'csv'
                                                )
                                            }
                                        >
                                            CSV
                                        </Button>
                                        &nbsp;|&nbsp;
                                        <Button
                                            variant="link"
                                            className='btnfont'
                                            onClick={() =>
                                                downloadTemplate(
                                                    ['name', 'description'],
                                                    ['Information Technology', 'Handles all IT related operations and infrastructure'],
                                                    'departments-template',
                                                    'xlsx'
                                                )
                                            }
                                        >
                                            XLSX
                                        </Button>
                                    </div>

                                </div>

                                <Modal.Footer className="modal-footer-custom px-0">
                                    <Button variant="outline-secondary" onClick={() => {
                                        setShowAddModal(false);
                                        setActiveTab('manual');
                                    }}>{t("cancel")}</Button>
                                    <Button variant="primary" onClick={handleImport}>{t("import")}</Button>
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
