import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button, Image, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Person, BoxArrowRight } from 'react-bootstrap-icons';
import logo from '../assets/logo.png';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const closeMenu = () => setExpanded(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };


  return (
    <header className="fixed-top">
      {/* Top Bar */}
      <div className="background-header py-2" style={{ position: 'sticky', top: 0, zIndex: 1030 }}>
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Image
              src={logo} // Replace with your actual logo path
              alt="Bank of Baroda"
              width={155}
              className="me-2 imgbob"
            />

          </div>
          <div className="d-flex align-items-center fonnav">
            <NavDropdown
              title="English (US)"
              id="language-dropdown"
              className="text-white fonnav"
              menuVariant="light"
            >
              <NavDropdown.Item>English (US)</NavDropdown.Item>
              <NavDropdown.Item>हिंदी</NavDropdown.Item>
            </NavDropdown>
            <Button variant="link" className="text-white position-relative me-2">
              <Bell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Button>
            <Dropdown align="end" className="d-flex align-items-center">
              <Dropdown.Toggle 
                as={Button} 
                variant="link" 
                className="text-white text-decoration-none d-flex align-items-center p-0"
                id="user-dropdown"
              >
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px' }}>
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

      {/* Navigation Bar */}
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
              <NavDropdown title="Admin" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/users" onClick={() => closeMenu()}>Users</NavDropdown.Item>
                <NavDropdown.Item href="/department" onClick={() => closeMenu()}>Department</NavDropdown.Item>
                <NavDropdown.Item href="/location" onClick={() => closeMenu()}>Location</NavDropdown.Item>
                <NavDropdown.Item href="/jobgrade" onClick={() => closeMenu()}>Job Grade</NavDropdown.Item>
                <NavDropdown.Item href="/position" onClick={() => closeMenu()}>Position</NavDropdown.Item>
                <NavDropdown.Item href="/category" onClick={() => closeMenu()}>Category</NavDropdown.Item>
                <NavDropdown.Item href="/specialcategory" onClick={() => closeMenu()}>Special Category</NavDropdown.Item>
                <NavDropdown.Item href="relaxationtype" onClick={() => closeMenu()}>Relaxation Type</NavDropdown.Item>
                <NavDropdown.Item href="/document" onClick={() => closeMenu()}>Document</NavDropdown.Item>
                <NavDropdown.Item href="/interviewpanel" onClick={() => closeMenu()}>Interview Panel</NavDropdown.Item>
              </NavDropdown>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
