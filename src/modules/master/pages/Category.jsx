// src/pages/Category.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { validateCategoryForm } from '../../../shared/utils/category-validations';
import '../../../style/css/user.css';
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import editIcon from "../../../assets/edit_icon.png";
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { FileMeta, downloadTemplate, importFromCSV } from '../../../shared/components/FileUpload';
import { useTranslation } from "react-i18next";


const Category = () => {

    const { t } = useTranslation(["category"]);

    const [categories, setCategories] = useState([
        { id: 1, code: "UR", name: "Unreserved", description: "Candidates who do not fall under any reservation category and compete on open merit." },
        { id: 2, code: "OBC", name: "Other Backward Classes", description: "Socially and educationally backward groups eligible for government reservation benefits." },
        { id: 3, code: "SC", name: "Scheduled Caste", description: "Historically disadvantaged communities recognized for reservation under the Constitution." }
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
    // file states (shared with FileUpload helpers)
    const [selectedCSVFile, setSelectedCSVFile] = useState(null);
    const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setErrors(prev => {
            const obj = { ...prev };
            delete obj[name];
            return obj;
        });
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ code: '', name: '', description: '' });
        setErrors({});
        setActiveTab("manual");
        setSelectedCSVFile(null);
        setSelectedXLSXFile(null);
        setShowAddModal(true);
    };

    const openEditModal = (c) => {
        setIsEditing(true);
        setEditingId(c.id);
        setFormData({
            code: c.code,
            name: c.name,
            description: c.description
        });
        setErrors({});
        setActiveTab("manual");
        setShowAddModal(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            code: (formData.code || '').trim(),
            name: (formData.name || '').trim(),
            description: (formData.description || '').trim()
        };

        const { valid, errors: vErrors } = validateCategoryForm(payload, {
            existing: categories,
            currentId: isEditing ? editingId : null
        });

        if (!valid) {
            setErrors(vErrors);
            return;
        }

        if (isEditing) {
            setCategories(prev =>
                prev.map(c => (c.id === editingId ? { ...c, ...payload } : c))
            );
        } else {
            const newItem = {
                id: Math.max(...categories.map(c => c.id), 0) + 1,
                ...payload
            };
            setCategories(prev => [...prev, newItem]);
        }

        setShowAddModal(false);
    };

    const openDeleteModal = (c) => {
        setDeleteTarget({ id: c.id, name: c.name });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    // Wrapper to call shared importFromCSV with a mapRow that fits categories
    const handleImport = async () => {
        await importFromCSV({
            selectedCSVFile,
            selectedXLSXFile,
            list: categories,
            setList: setCategories,
            // map parsed CSV row -> { code, name, description } (no id)
            mapRow: (row) => {
                // Accept multiple header variants
                const get = (r, ...keys) => {
                    for (const k of keys) {
                        if (Object.prototype.hasOwnProperty.call(r, k) && String(r[k] ?? '').trim() !== '') return String(r[k]).trim();
                    }
                    return '';
                };
                return {
                    code: get(row, 'code', 'categorycode', 'category_code'),
                    name: get(row, 'name', 'categoryname', 'category_name'),
                    description: get(row, 'description', 'desc', 'details')
                };
            },
            // UI helpers so importer clears files/modal like your earlier code
            setSelectedCSVFile,
            setSelectedXLSXFile,
            setShowAddModal,
            setActiveTab
        });
    };

    // Pagination & filtering
    const filtered = categories.filter(c =>
        Object.values(c).some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexLast = currentPage * itemsPerPage;
    const indexFirst = indexLast - itemsPerPage;
    const current = filtered.slice(indexFirst, indexLast);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <Container fluid className="user-container">
            <div className="user-content">
                {/* HEADER */}
                <div className="user-header">
                    <h2>{t("categories")}</h2>
                    <div className="user-actions">
                        <div className="search-box">
                            <Search className="search-icon" />
                            <Form.Control
                                type="text"
                                placeholder={t("search_placeholder")}
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="search-input"
                            />
                        </div>

                        <Button variant="primary" className="add-button" onClick={openAddModal}>
                            <Plus size={20} className="me-1" /> {t("add")}
                        </Button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="table-responsive">
                    <Table hover className="user-table">
                        <thead>
                            <tr>
                                <th>{t("s_no")}</th>
                                <th>{t("code")}</th>
                                <th>{t("name")}</th>
                                <th>{t("description")}</th>
                                <th style={{ textAlign: "center" }}>{t("actions")}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {current.length > 0 ? (
                                current.map((c, idx) => (
                                    <tr key={c.id}>
                                        <td>{indexFirst + idx + 1}</td>
                                        <td data-label={t("code") + ":"}>
                                            &nbsp;{c.code}</td>
                                        <td data-label={t("name") + ":"}>
                                            &nbsp;{c.name}</td>
                                        <td data-label={t("description") + ":"}>
                                            &nbsp;{c.description}</td>

                                        <td>
                                            <div className="action-buttons">
                                                <Button variant="link" className="action-btn view-btn">
                                                    <img src={viewIcon} className="icon-16" alt="View" />
                                                </Button>
                                                <Button variant="link" className="action-btn edit-btn" onClick={() => openEditModal(c)}>
                                                    <img src={editIcon} className="icon-16" alt="Edit" />
                                                </Button>
                                                <Button variant="link" className="action-btn delete-btn" onClick={() => openDeleteModal(c)}>
                                                    <img src={deleteIcon} className="icon-16" alt="Delete" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center">{t("no_categories")}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* PAGINATION */}
                {filtered.length > 0 && (
                    <div className="pagination-container">
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
                    </div>
                )}

                {/* ADD / EDIT MODAL */}
                <Modal
                    show={showAddModal}
                    onHide={() => setShowAddModal(false)}
                    size="lg"
                    centered
                    className="user-modal"
                    scrollable
                    fullscreen="sm-down"
                >
                    <Modal.Header closeButton className="modal-header-custom">
                        <div>
                            <Modal.Title>
                                {isEditing ? t("edit_category") : t("add_category")}
                            </Modal.Title>
                            <p className="mb-0 small text-muted">{t("choose_add_method")}</p>
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
                                    {t("manual_entry")}
                                </Button>

                                <Button
                                    variant={activeTab === "import" ? "light" : "outline-light"}
                                    className={`tab-button ${activeTab === "import" ? "active" : ""}`}
                                    onClick={() => setActiveTab("import")}
                                >
                                    {t("import_file")}
                                </Button>
                            </div>
                        )}

                        {/* MANUAL FORM */}
                        {activeTab === "manual" ? (
                            <Form onSubmit={handleSave} noValidate>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="form-label">{t("code")} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="code"
                                                value={formData.code}
                                                onChange={handleInputChange}
                                                className="form-control-custom"
                                                placeholder={t("enter_code")}
                                            />
                                            <ErrorMessage>{errors.code}</ErrorMessage>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="form-label">  {t("name")}  <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="form-control-custom"
                                                placeholder={t("enter_name")}

                                            />
                                            <ErrorMessage>{errors.name}</ErrorMessage>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="form-label"> {t("description")} <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="form-control-custom"
                                                placeholder={t("enter_description")}
                                            />
                                            <ErrorMessage>{errors.description}</ErrorMessage>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Modal.Footer className="modal-footer-custom px-0 pt-4">
                                    <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>{t("cancel")}</Button>
                                    <Button variant="primary" type="submit">{isEditing ? t("update") : t("save")}</Button>
                                </Modal.Footer>
                            </Form>

                        ) : (
                            <>
                                {/* IMPORT UI */}
                                <div className="import-area p-4 rounded" style={{ background: "#fceee9" }}>
                                    <div className="text-center mb-3">
                                        <div
                                            style={{
                                                width: 72,
                                                height: 72,
                                                borderRadius: 12,
                                                background: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: "auto"
                                            }}
                                        >
                                            <Upload size={32} />
                                        </div>

                                        <h5 className="mt-3 uploadfile">{t("upload_file")}</h5>
                                        <p className="text-muted small">
                                            {t("support_csv_xlsx")}
                                            {/* (CSV headers: code,name,description) */}
                                        </p>
                                    </div>

                                    <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                                        <div>
                                            <input
                                                id="upload-csv-cat"
                                                type="file"
                                                accept=".csv,text/csv"
                                                style={{ display: "none" }}
                                                onChange={(e) => setSelectedCSVFile(e.target.files[0] ?? null)}
                                            />
                                            <label htmlFor="upload-csv-cat">
                                                <Button as="span" variant="light" className="btnfont">
                                                    <i className="bi bi-upload me-1"></i> {t("upload_csv")}
                                                </Button>
                                            </label>
                                        </div>

                                        <div>
                                            <input
                                                id="upload-xlsx-cat"
                                                type="file"
                                                accept=".xlsx,.xls"
                                                style={{ display: "none" }}
                                                onChange={(e) => setSelectedXLSXFile(e.target.files[0] ?? null)}
                                            />
                                            <label htmlFor="upload-xlsx-cat">
                                                <Button as="span" variant="light" className="btnfont">
                                                    <i className="bi bi-upload me-1"></i> {t("upload_xlsx")}
                                                </Button>
                                            </label>
                                        </div>

                                        {/* show selected files using shared FileMeta */}
                                        <FileMeta file={selectedCSVFile} onRemove={() => setSelectedCSVFile(null)} />
                                        <FileMeta file={selectedXLSXFile} onRemove={() => setSelectedXLSXFile(null)} />
                                    </div>

                                    <div className="text-center mt-4 small">
                                        {t("download_template")}:&nbsp;

                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                downloadTemplate(
                                                    ['code', 'name', 'description'],
                                                    ['UR', 'Unreserved', 'Candidates who do not fall under any reservation category and compete on open merit.'],
                                                    'categories-template'
                                                )
                                            }
                                            className="btnfont"
                                        >
                                            {t("csv")}
                                        </Button>

                                        &nbsp;|&nbsp;

                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                downloadTemplate(
                                                    ['code', 'name', 'description'],
                                                    ['UR', 'Unreserved', 'Candidates who do not fall under any reservation category and compete on open merit.'],
                                                    'categories-template'
                                                )
                                            }
                                            className="btnfont"
                                        >
                                            {t("xlsx")}
                                        </Button>
                                    </div>

                                </div>


                                <Modal.Footer className="modal-footer-custom px-0 pt-4">
                                    <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>{t("cancel")}</Button>
                                    <Button variant="primary" onClick={handleImport}>  {t("import")}</Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal.Body>
                </Modal>

                {/* DELETE CONFIRM MODAL */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered dialogClassName="delete-confirm-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>{t("confirm_delete")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{t("delete_message")}</p>
                        {deleteTarget && <strong>{deleteTarget.name}</strong>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>{t("cancel")}</Button>
                        <Button variant="danger" onClick={confirmDelete}>{t("delete")}</Button>
                    </Modal.Footer>
                </Modal>


            </div>
        </Container>
    );
};

export default Category;
