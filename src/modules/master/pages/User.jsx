// src/pages/User.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus } from 'react-bootstrap-icons';
import '../../../style/css/user.css';
import { validateUserForm } from '../../../shared/utils/user-validations';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import viewIcon from "../../../assets/view_icon.png";
import deleteIcon from "../../../assets/delete_icon.png";
import editIcon from "../../../assets/edit_icon.png";
import { useTranslation } from "react-i18next";

// Shared upload utilities
import { FileMeta, downloadTemplate, importFromCSV } from '../../../shared/components/FileUpload';

const User = () => {
  const { t } = useTranslation(["user", "validation"]);

  // Sample user data
  const [users, setUsers] = useState([
    { id: 1, role: 'Manager', name: 'John Doe', email: 'john.doe@example.com', mobile: '9876543210' },
    { id: 2, role: 'Recruiter', name: 'Jane Smith', email: 'jane.smith@example.com', mobile: '9876543211' },
    { id: 3, role: 'Admin', name: 'Robert Johnson', email: 'robert.j@example.com', mobile: '9876543212' },
    { id: 4, role: 'Interviewer', name: 'Emily Davis', email: 'emily.d@example.com', mobile: '9876543213' },
    { id: 5, role: 'Recruiter', name: 'Michael Brown', email: 'michael.b@example.com', mobile: '9876543214' },
    { id: 6, role: 'Manager', name: 'Sarah Wilson', email: 'sarah.w@example.com', mobile: '9876543215' },
    { id: 7, role: 'Interviewer', name: 'David Miller', email: 'david.m@example.com', mobile: '9876543216' },
    { id: 8, role: 'Admin', name: 'Lisa Anderson', email: 'lisa.a@example.com', mobile: '9876543217' },
    { id: 9, role: 'Recruiter', name: 'James Taylor', email: 'james.t@example.com', mobile: '9876543218' },
    { id: 10, role: 'Manager', name: 'Jennifer Thomas', email: 'jennifer.t@example.com', mobile: '9876543219' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'import'
  const [errors, setErrors] = useState({});

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  // import file states (local to this page)
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  // helpers
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
    setEditingUserId(null);
    setFormData({
      role: '',
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setActiveTab('manual');
    setSelectedCSVFile(null);
    setSelectedXLSXFile(null);
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setEditingUserId(user.id);
    setFormData({
      role: user.role || '',
      fullName: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setActiveTab('manual');
    setShowAddModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const options = {
      requirePassword: !isEditing,
      existing: users,
      currentId: isEditing ? editingUserId : null
    };
    const { valid, errors: vErrors } = validateUserForm(formData, options);

    if (!valid) {
      setErrors(vErrors);
      return;
    }

    setErrors({});

    if (!isEditing) {
      const newUser = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        role: formData.role,
        name: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        status: 'Active'
      };
      setUsers(prev => [...prev, newUser]);
    } else {
      setUsers(prev => prev.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            role: formData.role,
            name: formData.fullName,
            email: formData.email,
            mobile: formData.mobile,
          };
        }
        return u;
      }));
    }

    setShowAddModal(false);
    setIsEditing(false);
    setEditingUserId(null);
    setFormData({
      role: '',
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: ''
    });
  };

  const openDeleteModal = (user) => {
    setDeleteTarget({ id: user.id, name: user.name, email: user.email });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Import wrapper using the shared generic importer
  const handleImport = async () => {
    await importFromCSV({
      selectedCSVFile,
      selectedXLSXFile,
      list: users,
      setList: setUsers,
      // map CSV parsed row -> user object (no id)
      mapRow: (row) => {
        // accept various header names
        const get = (r, ...keys) => {
          for (const k of keys) {
            if (Object.prototype.hasOwnProperty.call(r, k) && String(r[k] ?? '').trim() !== '') return String(r[k]).trim();
          }
          return '';
        };
        return {
          role: get(row, 'role', 'position'),
          name: get(row, 'name', 'fullName', 'fullname'),
          email: get(row, 'email', 'email_address', 'mail'),
          mobile: get(row, 'mobile', 'phone', 'mobile_no', 'mobile number'),
          // password isn't stored client-side for appended list but map it if present
          password: get(row, 'password', 'pwd') // not used in display
        };
      },
      // keep default id assignment; no validateRow to match original behavior
      setSelectedCSVFile,
      setSelectedXLSXFile,
      setShowAddModal,
      setActiveTab
    });
  };

  // Pagination & filtering
  const filteredUsers = users.filter(user =>
    Object.values(user).some(v => String(v || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginate = (num) => setCurrentPage(num);

  return (
    <Container fluid className="user-container">
      <div className="user-content">
        <div className="user-header">
         <h2>{t("user:users")}</h2>

          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
                type="text"
              placeholder={t("user:search_by_user")}

                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="search-input"
              />
            </div>

            <Button variant="primary" className="add-button" onClick={openAddModal}>
              <Plus size={20} className="me-1" />  {t("add")}
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <Table hover className="user-table">
            <thead>
              <tr>
                        <th>{t("user:s.no.")}</th>
          <th>{t("user:role")}</th>
          <th>{t("user:name")}</th>
          <th>{t("user:email")}</th>
          <th>{t("user:mobile")}</th>
          <th style={{ textAlign: "center" }}>{t("user:actions")}</th>

              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, idx) => (
                  <tr key={user.id}>
                    <td>{indexOfFirstUser + idx + 1}</td>
                    <td data-label="Role:">&nbsp;{user.role}</td>
                    <td data-label="Name:">&nbsp;{user.name}</td>
                    <td data-label="Email:">&nbsp;{user.email}</td>
                    <td data-label="Mobile:">&nbsp;{user.mobile}</td>
                    <td>
                      <div className="action-buttons">
                        <Button variant="link" className="action-btn view-btn" title="View">
                          <img src={viewIcon} alt="View" className="icon-16" />
                        </Button>
                        <Button
                          variant="link"
                          className="action-btn edit-btn"
                          title="Edit"
                          onClick={() => openEditModal(user)}
                        >
                          <img src={editIcon} alt="Edit" className='icon-16' />
                        </Button>
                        <Button
                          variant="link"
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => openDeleteModal(user)}
                        >
                          <img src={deleteIcon} alt="Delete" className='icon-16' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">{t("user:noUsersFound")}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {filteredUsers.length > 0 && (
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
            setEditingUserId(null);
          }}
          size="lg"
          centered
          className="user-modal"
          fullscreen="sm-down"
          scrollable
        >
          <Modal.Header closeButton className="modal-header-custom">
            <div>
             <Modal.Title>
  {isEditing ? t("user:editUser") : t("user:addUser")}
</Modal.Title>

              <p className="mb-0 small text-muted para">{t("user:choose_add_method")}
</p>
            </div>
          </Modal.Header>

          <Modal.Body className="p-4">
            <div className="tab-buttons">
              <Button
                variant={activeTab === 'manual' ? 'light' : 'outline-light'}
                className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={() => setActiveTab('manual')}
              >
              {t("user:manual_entry")}
              </Button>
              <Button
                variant={activeTab === 'import' ? 'light' : 'outline-light'}
                className={`tab-button ${activeTab === 'import' ? 'active' : ''}`}
                onClick={() => setActiveTab('import')}
              >
               {t("user:import_file")}
              </Button>
            </div>

           {activeTab === 'manual' ? (
  <Form onSubmit={handleSave} noValidate>
    <Row className="g-3">

      {/* ROLE */}
      <Col xs={12} md={6}>
        <Form.Group controlId="formRole">
          <Form.Label>
            {t("user:role")} <span className="text-danger">*</span>
          </Form.Label>

          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="form-control-custom"
          >
            <option value="">{t("user:select_role")}</option>
            <option value="Admin">{t("user:admin")}</option>
            <option value="Manager">{t("user:manager")}</option>
            <option value="Recruiter">{t("user:recruiter")}</option>
            <option value="Interviewer">{t("user:interviewer")}</option>
          </Form.Select>

          <ErrorMessage>{errors.role}</ErrorMessage>
        </Form.Group>
      </Col>

      {/* FULL NAME */}
      <Col xs={12} md={6}>
        <Form.Group controlId="formFullName">
          <Form.Label>
            {t("user:fullName")} <span className="text-danger">*</span>
          </Form.Label>

          <Form.Control
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="form-control-custom"
            placeholder={t("user:enter_full_name")}
          />

          <ErrorMessage>{errors.fullName}</ErrorMessage>
        </Form.Group>
      </Col>

      {/* EMAIL */}
      <Col xs={12} md={6}>
        <Form.Group controlId="formEmail">
          <Form.Label>
            {t("user:email")} <span className="text-danger">*</span>
          </Form.Label>

          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-control-custom"
            placeholder={t("user:enter_email")}
          />

          <ErrorMessage>{errors.email}</ErrorMessage>
        </Form.Group>
      </Col>

      {/* MOBILE */}
      <Col xs={12} md={6}>
        <Form.Group controlId="formMobile">
          <Form.Label>
            {t("user:mobile")} <span className="text-danger">*</span>
          </Form.Label>

          <Form.Control
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className="form-control-custom"
            placeholder={t("user:enter_mobile")}
          />

          <ErrorMessage>{errors.mobile}</ErrorMessage>
        </Form.Group>
      </Col>

      {/* PASSWORD */}
      <Col xs={12} md={6}>
        <Form.Group controlId="formPassword">
          <Form.Label>
            {t("user:password")} <span className="text-danger">*</span>
          </Form.Label>

          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-control-custom"
            placeholder={t("user:enter_password")}
          />

          <ErrorMessage>{errors.password}</ErrorMessage>
        </Form.Group>
      </Col>

      {/* CONFIRM PASSWORD */}
      <Col xs={12} md={6}>
        <Form.Group controlId="formConfirmPassword">
          <Form.Label>
            {t("user:confirmPassword")} <span className="text-danger">*</span>
          </Form.Label>

          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="form-control-custom"
            placeholder={t("user:confirm_password")}
          />

          <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
        </Form.Group>
      </Col>

    </Row>

    <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
      <Button
        variant="outline-secondary"
        onClick={() => {
          setShowAddModal(false);
          setIsEditing(false);
          setEditingUserId(null);
        }}
        className="btn-cancel"
      >
        {t("user:cancel")}
      </Button>

      <Button variant="primary" type="submit" className="btn-save">
        {isEditing ? t("user:update") : t("user:save")}
      </Button>
    </Modal.Footer>
  </Form>
) : (

              <>
                {/* IMPORT UI */}
                <div className="import-area p-4 rounded" style={{ background: '#fceee9' }}>
                  <div className="text-center mb-3">
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff'
                    }}>
                      <i className="bi bi-file-earmark-arrow-up" style={{ fontSize: 28 }}></i>
                    </div>
                  </div>

                  <h5 className="text-center uploadfile">{t("user:upload_file")}</h5>
                  <p className="text-center small">{t("user:support_csv_xlsx")}</p>

                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <div>
                      <input
                        id="upload-csv"
                        type="file"
                        accept=".csv,text/csv"
                        style={{ display: 'none' }}
                        onChange={(e) => setSelectedCSVFile(e.target.files[0] ?? null)}
                      />
                      <label htmlFor="upload-csv">
                        <Button variant="light" as="span" className='btnfont'>
                          <i className="bi bi-upload me-1"></i>{t("user:upload_csv")}
                        </Button>
                      </label>
                    </div>

                    <div>
                      <input
                        id="upload-xlsx"
                        type="file"
                        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        style={{ display: 'none' }}
                        onChange={(e) => setSelectedXLSXFile(e.target.files[0] ?? null)}
                      />
                      <label htmlFor="upload-xlsx">
                        <Button variant="light" as="span" className='btnfont'>
                          <i className="bi bi-upload me-1"></i>{t("user:upload_xlsx")}
                        </Button>
                      </label>
                    </div>

                    {/* show selected files using shared FileMeta */}
                    <FileMeta file={selectedCSVFile} onRemove={() => setSelectedCSVFile(null)} />
                    <FileMeta file={selectedXLSXFile} onRemove={() => setSelectedXLSXFile(null)} />
                  </div>

                  <div className="text-center mt-4 small">
                   {t("download_template")}:&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate(['role','name','email','mobile','password'], ['Manager','Sample User','sample@example.com','9876500000','Password123'], 'users-template')} className='btnfont'>CSV</Button>
                    &nbsp;|&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate(['role','name','email','mobile','password'], ['Manager','Sample User','sample@example.com','9876500000','Password123'], 'users-template')} className='btnfont'>XLSX</Button>
                  </div>
                </div>

                <Modal.Footer className="modal-footer-custom px-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingUserId(null); }}>{t("cancel")}</Button>
                  <Button variant="primary" onClick={handleImport}>{t("user:import")}
</Button>
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
          size="l"
          dialogClassName="delete-confirm-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("user:confirm_delete")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{t("user:delete_confirm_msg")}</p>
            {deleteTarget && (
              <div style={{ fontSize: 14, color: '#333' }}>
                <strong>{deleteTarget.name}</strong>
                <div className="small text-muted">{deleteTarget.email}</div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={cancelDelete}>{t("user:cancel")}</Button>
            <Button variant="danger" onClick={confirmDelete}>{t("user:delete")}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};
export default User;
