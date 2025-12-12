// src/pages/User.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus } from 'react-bootstrap-icons';
import '../css/user.css';
import { ValidateUser } from '../validators/common-validations';
import ErrorMessage from '../components/ErrorMessage';
import viewIcon from "../assets/view_icon.png";
import deleteIcon from "../assets/delete_icon.png";
import editIcon from "../assets/edit_icon.png";

// Shared upload utilities
import { FileMeta, downloadTemplate, importFromCSV } from '../components/FileUpload';

const User = () => {
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
    const { valid, errors: vErrors } = ValidateUser(formData, options);

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
          <h2>Users</h2>
          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search by User"
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
                <th>Role</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Mobile Number</th>
                <th style={{ textAlign: "center" }}>Actions</th>
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
                  <td colSpan="6" className="text-center">No users found</td>
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
              <Modal.Title>{isEditing ? 'Edit User' : 'Add User'}</Modal.Title>
              <p className="mb-0 small text-muted para">Choose to add manually or import from CSV/XLSX file.</p>
            </div>
          </Modal.Header>

          <Modal.Body className="p-4">
            <div className="tab-buttons">
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

            {activeTab === 'manual' ? (
              <Form onSubmit={handleSave} noValidate>
                <Row className="g-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formRole">
                      <Form.Label>Select Role <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="form-control-custom"
                      >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Recruiter">Recruiter</option>
                        <option value="Interviewer">Interviewer</option>
                      </Form.Select>
                      <ErrorMessage>{errors.role}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formFullName">
                      <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-control-custom" placeholder="Enter full name" required />
                      <ErrorMessage>{errors.fullName}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control-custom" placeholder="Enter email address" required />
                      <ErrorMessage>{errors.email}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formMobile">
                      <Form.Label>Mobile No <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="form-control-custom" placeholder="Enter mobile number" required />
                      <ErrorMessage>{errors.mobile}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formPassword">
                      <Form.Label>Password<span className="text-danger">*</span></Form.Label>
                      <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-control-custom" placeholder="Enter password" />
                      <ErrorMessage>{errors.password}</ErrorMessage>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group controlId="formConfirmPassword">
                      <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="form-control-custom" placeholder="Confirm password" />
                      <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
                    </Form.Group>
                  </Col>
                </Row>

                <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingUserId(null); }} className="btn-cancel">Cancel</Button>
                  <Button variant="primary" type="submit" className="btn-save">{isEditing ? 'Update' : 'Save'}</Button>
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

                  <h5 className="text-center uploadfile">Upload File</h5>
                  <p className="text-center small">Support for CSV and XLSX formats</p>

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
                          <i className="bi bi-upload me-1"></i> Upload CSV
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
                          <i className="bi bi-upload me-1"></i> Upload XLSX
                        </Button>
                      </label>
                    </div>

                    {/* show selected files using shared FileMeta */}
                    <FileMeta file={selectedCSVFile} onRemove={() => setSelectedCSVFile(null)} />
                    <FileMeta file={selectedXLSXFile} onRemove={() => setSelectedXLSXFile(null)} />
                  </div>

                  <div className="text-center mt-4 small">
                    Download template:&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate(['role','name','email','mobile','password'], ['Manager','Sample User','sample@example.com','9876500000','Password123'], 'users-template')} className='btnfont'>CSV</Button>
                    &nbsp;|&nbsp;
                    <Button variant="link" onClick={() => downloadTemplate(['role','name','email','mobile','password'], ['Manager','Sample User','sample@example.com','9876500000','Password123'], 'users-template')} className='btnfont'>XLSX</Button>
                  </div>
                </div>

                <Modal.Footer className="modal-footer-custom px-0">
                  <Button variant="outline-secondary" onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingUserId(null); }}>Cancel</Button>
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
          size="l"
          dialogClassName="delete-confirm-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this user?</p>
            {deleteTarget && (
              <div style={{ fontSize: 14, color: '#333' }}>
                <strong>{deleteTarget.name}</strong>
                <div className="small text-muted">{deleteTarget.email}</div>
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

export default User;
