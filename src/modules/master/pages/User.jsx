// src/pages/User.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal } from 'react-bootstrap';
import { Search, Plus } from 'react-bootstrap-icons';
import '../../../style/css/user.css';
import { validateUserForm } from '../../../shared/utils/user-validations';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { useTranslation } from "react-i18next";

import masterApiService from '../services/masterApiService';
import CryptoJS from "crypto-js";
import { useSelector } from "react-redux";

const SECRET_KEY = "fdf4-832b-b4fd-ccfb9258a6b3";

const User = () => {
  const { t } = useTranslation(["user", "validation"]);
  const authUser = useSelector((state) => state.user.authUser?.user);

  // -------------------- STATE --------------------
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [showAddModal, setShowAddModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  // -------------------- HELPERS --------------------
  const encryptPassword = (password) =>
    CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors(prev => {
      const copy = { ...prev };
      if (copy[name]) delete copy[name];
      return copy;
    });

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // -------------------- API --------------------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await masterApiService.getRegister(); // SAME API AS OLD CODE
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -------------------- MODAL --------------------
  const openAddModal = () => {
    setFormData({
      role: '',
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowAddModal(true);
  };

  // -------------------- SAVE (ADD ONLY) --------------------
  const handleSave = async (e) => {
    e.preventDefault();

    const options = {
      requirePassword: true,
      existing: users
    };

    const { valid, errors: vErrors } = validateUserForm(formData, options);

    if (!valid) {
      setErrors(vErrors);
      return;
    }

    try {
      await masterApiService.registerUser({
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        password: encryptPassword(formData.password),
        role: formData.role,
        created_by: authUser?.sub
      });

      await fetchUsers();   // refresh list
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "User creation failed");
    }
  };

  // -------------------- FILTER + PAGINATION --------------------
  const filteredUsers = users.filter(user =>
    Object.values(user || {}).some(v =>
      String(v || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (num) => setCurrentPage(num);

  // -------------------- UI --------------------
  return (
    <Container fluid className="user-container">
      <div className="user-content">

        {/* HEADER */}
        <div className="user-header">
          <h2>{t("user:users")}</h2>

          <div className="user-actions">
            <div className="search-box">
              <Search className="search-icon " />
              <Form.Control
                type="text"
                className='search-input '
                placeholder={t("user:search_by_user")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Button onClick={openAddModal} className='add-button'>
              <Plus size={18} className="me-1 " /> {t("add")}
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <Table hover className="user-table">
            <thead>
              <tr>
                <th>{t("user:s.no.")}</th>
                <th>{t("user:role")}</th>
                <th>{t("user:name")}</th>
                <th>{t("user:email")}</th>
                <th>{t("user:mobile")}</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, idx) => (
                  <tr key={idx}>
                    <td>{indexOfFirstUser + idx + 1}</td>
                    <td>{user.role}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    {loading ? "Loading..." : t("user:noUsersFound")}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    &laquo;
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => paginate(p)}
                    >
                      {p}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* ADD MODAL */}
        <Modal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          size="lg"
          centered
          className="user-modal"
          fullscreen="sm-down"
        >
          <Modal.Header closeButton className="modal-header-custom">
            <div>
              <Modal.Title>{t("user:addUser")}</Modal.Title>
              
            </div>
          </Modal.Header>

          <Modal.Body className="p-4">
            <Form onSubmit={handleSave}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("user:role")} *</Form.Label>
                    <Form.Select 
                      name="role" 
                      className="form-control-custom"
                      value={formData.role} 
                      onChange={handleInputChange}
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

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("user:fullName")} *</Form.Label>
                    <Form.Control 
                      name="fullName" 
                      className="form-control-custom"
                      value={formData.fullName} 
                      onChange={handleInputChange}
                      placeholder={t("user:enter_full_name")}
                    />
                    <ErrorMessage>{errors.fullName}</ErrorMessage>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("user:email")} *</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email" 
                      className="form-control-custom"
                      value={formData.email} 
                      onChange={handleInputChange}
                      placeholder={t("user:enter_email")}
                    />
                    <ErrorMessage>{errors.email}</ErrorMessage>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("user:mobile")} *</Form.Label>
                    <Form.Control 
                      name="mobile" 
                      className="form-control-custom"
                      value={formData.mobile} 
                      onChange={handleInputChange}
                      placeholder={t("user:enter_mobile")}
                    />
                    <ErrorMessage>{errors.mobile}</ErrorMessage>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("user:password")} *</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="password" 
                      className="form-control-custom"
                      value={formData.password} 
                      onChange={handleInputChange}
                      placeholder={t("user:enter_password")}
                    />
                    <ErrorMessage>{errors.password}</ErrorMessage>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>{t("user:confirmPassword")} *</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="confirmPassword" 
                      className="form-control-custom"
                      value={formData.confirmPassword} 
                      onChange={handleInputChange}
                      placeholder={t("user:confirm_password")}
                    />
                    <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
                  </Form.Group>
                </Col>
              </Row>

              <Modal.Footer className="px-0 pt-3 pb-0 modal-footer-custom">
                <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>
                  {t("user:cancel")}
                </Button>
                <Button variant="primary" type="submit">
                  {t("user:save")}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

      </div>
    </Container>
  );
};

export default User;
