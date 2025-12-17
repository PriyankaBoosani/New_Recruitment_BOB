// src/pages/RelaxationType.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus, Upload } from 'react-bootstrap-icons';
import { validateRelaxationTypeForm } from '../../../shared/utils/relaxationtype-validations';
import '../../../style/css/user.css';
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import editIcon from "../../../assets/edit_icon.png";
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { FileMeta, downloadTemplate, importFromCSV } from '../../../shared/components/FileUpload';

import { useTranslation } from "react-i18next";



const RelaxationType = () => {
const { t } = useTranslation(["relaxationType"])


  const [items, setItems] = useState([
    { id: 1, code: 'Age Relaxation', inputType: 'Number', operator: '<=', description: 'Additional years added to the maximum eligible age limit for certain categories' },
    { id: 2, code: 'Fee Relaxation', inputType: 'Number', operator: '==', description: 'Reduction or waiver in application fee for eligible categories' },
    { id: 3, code: 'Vacancies', inputType: 'Number', operator: '>=', description: 'Vacancies' },
    { id: 4, code: 'Cut Off Relaxation', inputType: 'Number', operator: '==', description: 'Banking Exam Relaxation for eligible categories' },
    { id: 5, code: 'ExperienceRelaxation', inputType: 'Number', operator: '>=', description: 'Reduction in required years of experience for eligible candidates' },
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
    code: '',
    operator: '<=',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // only operator options are needed now
  const operatorOptions = ['select an option', '<=', '>=', '==', '!=', '<', '>'];

  // --- File helpers (same as Department)
  const removeCSV = () => setSelectedCSVFile(null);
  const removeXLSX = () => setSelectedXLSXFile(null);

  // import wrapper using shared helper (mirrors Department: simple mapping, no validateRow)
  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: items,
      setList: setItems,
      // simple mapping - accept multiple header variants and map to fields
      mapRow: (row) => ({
        code: (row.code ?? row.title ?? row.name ?? '').trim(),
        // force Number for inputType
        inputType: 'Number',
        operator: (row.operator ?? row.op ?? '').trim(),
        description: (row.description ?? row.desc ?? '').trim()
      }),
      // no validateRow to match Department behavior
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => {
      const copy = { ...prev }; if (copy[name]) delete copy[name]; return copy;
    });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ code: '', operator: '', description: '' });
    setErrors({});
    setActiveTab('manual');
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };

  const openEditModal = (it) => {
    setIsEditing(true);
    setEditingId(it.id);
    setFormData({ code: '', operator: '', description: '' });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      code: String(formData.code || '').trim(),
      // always Number
      inputType: 'Number',
      operator: String(formData.operator || '').trim(),
      description: String(formData.description || '').trim()
    };

    const { valid, errors: vErrors } = validateRelaxationTypeForm(payload, {
      existing: items,
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
      setItems(prev => prev.map(it => it.id === editingId ? { ...it, ...payload } : it));
    } else {
      const newItem = { id: Math.max(0, ...items.map(i => i.id)) + 1, ...payload };
      setItems(prev => [...prev, newItem]);
    }

    setShowAddModal(false);
  };

  const openDeleteModal = (it) => {
    setDeleteTarget({ id: it.id, name: it.code });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Filtering & pagination
  const filtered = items.filter(i =>
    [i.code, i.inputType, i.operator, i.description].some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
        <h2>{t("relaxation_type")}</h2>

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

        <div className="table-responsive">
          <Table hover className="user-table">
            <thead>
              <tr>
                <th>{t("s_no")}</th>
<th>{t("code")}</th>
<th>{t("input")}</th>
<th>{t("operator")}</th>
<th>{t("description")}</th>
<th style={{ textAlign: 'center' }}>{t("actions")}</th>

              </tr>
            </thead>
            <tbody>
              {current.length > 0 ? current.map((it, idx) => (
                <tr key={it.id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td data-label="Code: ">&nbsp;{it.code}</td>
                  <td data-label="Input: ">&nbsp;{it.inputType}</td>
                  <td data-label="Operator: ">&nbsp;{it.operator}</td>
                  <td data-label="Description: ">&nbsp;{it.description}</td>
                  <td>
                    <div className="action-buttons">
                      <Button variant="link" className="action-btn view-btn" title="View"><img src={viewIcon} alt="View" className="icon-16" /></Button>
                      <Button variant="link" className="action-btn edit-btn" title="Edit" onClick={() => openEditModal(it)}><img src={editIcon} alt="Edit" className="icon-16" /></Button>
                      <Button variant="link" className="action-btn delete-btn" title="Delete" onClick={() => openDeleteModal(it)}><img src={deleteIcon} alt="Delete" className="icon-16" /></Button>
                    </div>
                  </td>
                </tr>
              )) : (
               <tr><td colSpan="6" className="text-center">{t("no_items")}</td></tr>

              )}
            </tbody>
          </Table>
        </div>

        {filtered.length > 0 && (
          <div className="pagination-container">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button></li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}><button onClick={() => setCurrentPage(number)} className="page-link">{number}</button></li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button></li>
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
            <Modal.Title>
  {isEditing ? t("edit_relaxation") : t("add_relaxation")}
</Modal.Title>

<p className="mb-0 small text-muted">{t("choose_add_method")}</p>

            </div>
          </Modal.Header>

          <Modal.Body className="p-4">
            {!isEditing && (
              <div className="tab-buttons mb-4">
                <Button variant={activeTab === 'manual' ? 'light' : 'outline-light'} className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`} onClick={() => setActiveTab('manual')}>{t("manual_entry")}</Button>
                <Button variant={activeTab === 'import' ? 'light' : 'outline-light'} className={`tab-button ${activeTab === 'import' ? 'active' : ''}`} onClick={() => setActiveTab('import')}>{t("import_file")}</Button>
              </div>
            )}

            {activeTab === 'manual' ? (
              <Form onSubmit={handleSave} noValidate>
                <Row className="g-3">
                  <Col xs={12} md={12}>
                    <Form.Group controlId="formCode">
                      <Form.Label className="form-label">{t("code")} <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" name="code" value={formData.code} onChange={handleInputChange} className="form-control-custom" placeholder={t("enter_code")} aria-invalid={!!errors.code} aria-describedby="codeError" />
                      <ErrorMessage id="codeError">{errors.code}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  {/* Input is fixed to Number; no select shown */}
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formInputFixed">
                      <Form.Label className="form-label">{t("input")}</Form.Label>
                      <Form.Control type="text" readOnly value="Number" className="form-control-custom" />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formOperator">
                      <Form.Label className="form-label">{t("operator")} <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="operator"
                        value={formData.operator}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        aria-invalid={!!errors.operator}
                        aria-describedby="operatorError"
                      >
                        <option value="">{t("select_operator")}</option>
                        {operatorOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </Form.Select>
                      <ErrorMessage id="operatorError">{errors.operator}</ErrorMessage>
                    </Form.Group>
                  </Col>


                  <Col xs={12}>
                    <Form.Group controlId="formDescription">
<Form.Label className="form-label">
  {t("description")} <span className="text-danger">*</span>
</Form.Label>
                      <Form.Control as="textarea" rows={3} name={t("enter_description")} value={formData.description} onChange={handleInputChange} className="form-control-custom" placeholder={t("enter_description")}
aria-invalid={!!errors.description} aria-describedby="descError" />
                      <ErrorMessage id="descError">{errors.description}</ErrorMessage>
                    </Form.Group>
                  </Col>
                </Row>

                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingId(null); }}>{t("cancel")}</Button>
                  <Button variant="primary" type="submit">{isEditing ? t("update") : t("save")}</Button>
                </Modal.Footer>
              </Form>
            ) : (
              <>
                <div className="import-area p-4 rounded" style={{ background: '#fceee9' }}>
  <div className="text-center mb-3">
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 12,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff'
      }}
    >
      <Upload size={32} />
    </div>

    <h5 className="text-center uploadfile">{t("upload_file")}</h5>

    <p className="text-center small">
      {t("support_csv_xlsx")}
    </p>
  </div>

  <div className="d-flex justify-content-center gap-3 mt-3">
    {/* CSV Upload */}
    <div>
      <input
        id="upload-csv-relax"
        type="file"
        accept=".csv,text/csv"
        style={{ display: 'none' }}
        onChange={(e) => setSelectedCSVFile(e.target.files[0] ?? null)}
      />
      <label htmlFor="upload-csv-relax">
        <Button variant="light" as="span" className="btnfont">
          <i className="bi bi-upload me-1"></i> {t("upload_csv")}
        </Button>
      </label>
    </div>

    {/* XLSX Upload */}
    <div>
      <input
        id="upload-xlsx-relax"
        type="file"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={(e) => setSelectedXLSXFile(e.target.files[0] ?? null)}
      />
      <label htmlFor="upload-xlsx-relax">
        <Button variant="light" as="span" className="btnfont">
          <i className="bi bi-upload me-1"></i> {t("upload_xlsx")}
        </Button>
      </label>
    </div>

    <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
    <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />
  </div>

  <div className="text-center mt-4 small">
    {t("download_template")}:&nbsp;
    <Button
      variant="link"
      onClick={() =>
        downloadTemplate(
          ['code', 'operator', 'description'],
          ['Age Relaxation', '<=', 'Additional years added to age limit'],
          'relaxation-types-template'
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
          ['code', 'operator', 'description'],
          ['Age Relaxation', '<=', 'Additional years added to age limit'],
          'relaxation-types-template'
        )
      }
      className="btnfont"
    >
      {t("xlsx")}
    </Button>
  </div>
</div>

                <Modal.Footer className="modal-footer-custom px-0">
            <Button
  variant="outline-secondary"
  onClick={() => { setShowAddModal(false); setActiveTab('manual'); }}
>
  {t("cancel")}
</Button>

<Button
  variant="primary"
  onClick={handleImport}
>
  {t("import")}
</Button>

                </Modal.Footer>
              </>
            )}
          </Modal.Body>
        </Modal>

        {/* Delete confirm modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered dialogClassName="delete-confirm-modal" container={typeof document !== 'undefined' ? document.body : undefined}>
          <Modal.Header closeButton><Modal.Title>{t("confirm_delete")}</Modal.Title></Modal.Header>
          <Modal.Body>
           <p>{t("delete_message")}</p>
            {deleteTarget && <div className="delete-confirm-user"><strong>{deleteTarget.name}</strong></div>}
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

export default RelaxationType;
