import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, NavDropdown, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../providers/userSlice';
import { setLanguage } from '../../i18n/store/languageSlice';
import { useTranslation } from "react-i18next";
import i18n from '../../i18n/i18n';

const Header = () => {

  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ===================== USER FROM REDUX ===================== */
  const userSlice = useSelector((state) => state.user);
  const user = userSlice?.user;
  console.log("Header User from Redux:", user);

  /* ===================== USER DROPDOWN STATE ===================== */
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const closeMenu = () => setExpanded(false);

  /* ===================== INITIALS LOGIC ===================== */
  const getInitials = (fullName = "") => {
    if (!fullName.trim()) return "";
    const parts = fullName.trim().split(" ").filter(Boolean);
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  /* ===================== DISPLAY NAME (ADDED – NO REMOVALS) ===================== */
  const displayName =
    user?.name ||
    (user?.email
      ? user.email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase())
      : "");

  /* ===================== LANGUAGE CHANGE ===================== */
  const changeLang = (lng) => {
    dispatch(setLanguage(lng));
    i18n.changeLanguage(lng);
  };

  /* ===================== LOGOUT ===================== */
  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };
  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin";

  /* ===================== OUTSIDE CLICK ===================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed-top">

      {/* ===================== TOP BAR ===================== */}
      <div className="background-header py-2" style={{ position: 'sticky', top: 0, zIndex: 1030 }}>
        <Container fluid className="d-flex justify-content-between align-items-center">

          {/* Logo */}
          <div className="d-flex align-items-center">
            <Image
              src={logo}
              alt="Bank of Baroda"
              width={155}
              className="me-2 imgbob"
            />
          </div>

          {/* Right Section */}
          <div className="d-flex align-items-center fonnav">

            {/* LANGUAGE */}
            <div className="d-flex align-items-center text-white me-3">
              <span
                className={`me-2 cursor-pointer ${i18n.language === 'en' ? 'fw-bold' : 'opacity-75'}`}
                onClick={() => changeLang("en")}
              >
                English
              </span>
              <span className="me-2">|</span>
              <span
                className={`cursor-pointer ${i18n.language === 'hi' ? 'fw-bold' : 'opacity-75'}`}
                onClick={() => changeLang("hi")}
              >
                हिंदी
              </span>
            </div>

            {/* ===================== USER DROPDOWN ===================== */}
            <div className="position-relative" ref={dropdownRef}>
              <div
                className="d-flex align-items-center gap-2"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowDropdown(prev => !prev)}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    color: "#42579f"
                  }}
                >
                  {getInitials(displayName)}
                </div>

                <span className="text-white fonnav">
                  {displayName}
                  <FontAwesomeIcon
                    icon={showDropdown ? faChevronUp : faChevronDown}
                    className="ms-1"
                  />
                </span>
              </div>

              {showDropdown && (
                <div
                  className="position-absolute end-0 mt-2 bg-white border rounded shadow p-2"
                  style={{ minWidth: "200px", zIndex: 1050 }}
                >
                  <p className="mb-1 fw-semibold">{displayName}</p>
                  <p className="mb-2 text-muted small">{user?.role}</p>
                  <div
                    style={{ cursor: "pointer" }}
                    className="text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* ===================== NAVBAR ===================== */}
      <Navbar
        bg="white"
        expand="lg"
        className="border-bottom py-0"
        expanded={expanded}
      >
        <Container fluid>
          <Navbar.Toggle
            aria-controls="main-navbar-nav"
            onClick={() => setExpanded(expanded ? false : true)}
          />

          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="me-auto">
              {!isAdmin && (
                <Nav.Link as={Link} to="/job-posting" onClick={closeMenu}>
                  {t("job_postings")}
                </Nav.Link>
              )}
              {/* <Nav.Link
                as={Link}
                to="/candidate-preview"
                onClick={closeMenu}
              >
                Candidate Preview
              </Nav.Link> */}


              {!isAdmin && (
                <Nav.Link as={Link} to="/candidate-workflow" onClick={closeMenu}>
                  Candidate Workflow
                </Nav.Link>
              )}

              {/* <Nav.Link as={Link} to="/dashboard" onClick={closeMenu}>Dashboard</Nav.Link>
              <Nav.Link href="#candidate-shortlist">Candidate Shortlist</Nav.Link>
              <Nav.Link href="#interviews">Interviews</Nav.Link>
              <Nav.Link href="#relaxation">Relaxation</Nav.Link>
              <Nav.Link href="#bulk-upload">Bulk Upload</Nav.Link>
              <Nav.Link href="/interviewpanel"> Interview Panel</Nav.Link> */}
                <Nav.Link as={Link} to="/interviewpanel" onClick={closeMenu}>
                  Committee Management
                </Nav.Link>
              {/* Admin Menu */}
              {isAdmin && (
                <NavDropdown title={t("admin")} id="admin-dropdown">
                  <NavDropdown.Item as={Link} to="/users" onClick={closeMenu}>
                    {t("users")}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/department" onClick={closeMenu}>
                    {t("department")}
                  </NavDropdown.Item>

                  {/* <NavDropdown.Item as={Link} to="/location" onClick={closeMenu}>
                    {t("location")}
                  </NavDropdown.Item> */}

                  <NavDropdown.Item as={Link} to="/jobgrade" onClick={closeMenu}>
                    {t("job_grade")}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/position" onClick={closeMenu}>
                    {t("position")}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/category" onClick={closeMenu}>
                    {t("category")}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/certification" onClick={closeMenu}>
                    {t("certification")}
                  </NavDropdown.Item>

                  {/* <NavDropdown.Item as={Link} to="/specialcategory" onClick={closeMenu}>
                    {t("special_category")}
                  </NavDropdown.Item> */}

                  <NavDropdown.Item as={Link} to="/document" onClick={closeMenu}>
                    {t("document")}
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/generic-or-annexures" onClick={closeMenu}>
                    {t("generic_or_annexures")}
                  </NavDropdown.Item>
                </NavDropdown>
              )}


            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
