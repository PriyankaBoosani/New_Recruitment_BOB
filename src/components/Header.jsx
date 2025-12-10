import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {  Bell, Person } from 'react-bootstrap-icons';
import logo from '../assets/logo.png'

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const closeMenu = () => setExpanded(false);


  return (
    <>
      {/* Top Bar */}
      <div className="background-header py-2">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Image
              src={logo} // Replace with your actual logo path
              alt="Bank of Baroda"
              width={155}
              className="me-2"
            />

          </div>
          <div className="d-flex align-items-center">
            <NavDropdown
              title="English (US)"
              id="language-dropdown"
              className="text-white me-3"
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
            <div className="d-flex align-items-center text-white">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                <Person color="white" />
              </div>
              <span>Jagadeesh</span>
            </div>
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
                <NavDropdown.Item href="#admin/postion" onClick={() => closeMenu()}>Position</NavDropdown.Item>
                <NavDropdown.Item href="#admin/category" onClick={() => closeMenu()}>Category</NavDropdown.Item>
                <NavDropdown.Item href="#admin/specialcategory" onClick={() => closeMenu()}>Special Category</NavDropdown.Item>
                <NavDropdown.Item href="#admin/relaxationtype" onClick={() => closeMenu()}>Relaxation Type</NavDropdown.Item>
                <NavDropdown.Item href="#admin/document" onClick={() => closeMenu()}>Document</NavDropdown.Item>
                <NavDropdown.Item href="#admin/interviewpanel" onClick={() => closeMenu()}>Interview Panel</NavDropdown.Item>
              </NavDropdown>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
