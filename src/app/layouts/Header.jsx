import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button, Image, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Person, BoxArrowRight } from 'react-bootstrap-icons';
import logo from '../../assets/logo.png';
import { useDispatch } from 'react-redux';
import { clearUser } from '../providers/userSlice';
import { setLanguage } from '../../i18n/store/languageSlice'; // <-- make sure this import exists
import { useTranslation } from "react-i18next";
import i18n from '../../i18n/i18n';


const Header = () => {
  const { i18n, t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => setExpanded(false);

  // ✅ LANGUAGE CHANGE FUNCTION
  const changeLang = (lng) => {
    dispatch(setLanguage(lng));  // update redux
    i18n.changeLanguage(lng);    // update i18next
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

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

            {/* LANG DROPDOWN */}
            <NavDropdown
              title={i18n.language === "hi" ? "हिंदी" : "English (US)"}
              id="language-dropdown"
              className="text-white fonnav"
              menuVariant="light"
            >
              <NavDropdown.Item onClick={() => changeLang("en")}>
                English (US)
              </NavDropdown.Item>

              <NavDropdown.Item onClick={() => changeLang("hi")}>
                हिंदी
              </NavDropdown.Item>
            </NavDropdown>

            {/* Notifications */}
            <Button variant="link" className="text-white position-relative me-2">
              <Bell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Button>

            {/* User Menu */}
            <Dropdown align="end" className="d-flex align-items-center">
              <Dropdown.Toggle
                as={Button}
                variant="link"
                className="text-white text-decoration-none d-flex align-items-center p-0"
                id="user-dropdown"
              >
                <div
                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: '24px', height: '24px' }}
                >
                  <Person color="white" />
                </div>
                <span className="text-white fonnav">Jagadeesh</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>
                  <BoxArrowRight className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
              <Nav.Link href="#dashboard">Dashboard</Nav.Link>
              <Nav.Link href="#job-postings">Job Postings</Nav.Link>
              <Nav.Link href="#candidate-shortlist">Candidate Shortlist</Nav.Link>
              <Nav.Link href="#interviews">Interviews</Nav.Link>
              <Nav.Link href="#relaxation">Relaxation</Nav.Link>
              <Nav.Link href="#bulk-upload">Bulk Upload</Nav.Link>

              {/* Admin Menu */}
              <NavDropdown title="Admin" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/users" onClick={closeMenu}>
                  Users
                </NavDropdown.Item>
                <NavDropdown.Item href="/department" onClick={closeMenu}>
                  Department
                </NavDropdown.Item>
                <NavDropdown.Item href="/location" onClick={closeMenu}>
                  Location
                </NavDropdown.Item>
                <NavDropdown.Item href="/jobgrade" onClick={closeMenu}>
                  Job Grade
                </NavDropdown.Item>
                <NavDropdown.Item href="/position" onClick={closeMenu}>
                  Position
                </NavDropdown.Item>
                <NavDropdown.Item href="/category" onClick={closeMenu}>
                  Category
                </NavDropdown.Item>
                <NavDropdown.Item href="/specialcategory" onClick={closeMenu}>
                  Special Category
                </NavDropdown.Item>
                <NavDropdown.Item href="relaxationtype" onClick={closeMenu}>
                  Relaxation Type
                </NavDropdown.Item>
                <NavDropdown.Item href="/document" onClick={closeMenu}>
                  Document
                </NavDropdown.Item>
                <NavDropdown.Item href="/interviewpanel" onClick={closeMenu}>
                  Interview Panel
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>

        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
