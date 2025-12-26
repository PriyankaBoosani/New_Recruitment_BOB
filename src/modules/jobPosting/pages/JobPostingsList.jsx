// src/modules/jobPostings/pages/JobPostingsList.jsx
import React from "react";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";
import { Plus, Search, Pencil, Trash, Eye } from "react-bootstrap-icons";
import "../../../style/css/JobPostingsList.css";
import submitIcon from "../../../assets/submitIcon.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import pos_edit_icon from '../../../assets/pos_edit_icon.png';
import pos_delete_icon from '../../../assets/pos_delete_icon.png';
import pos_plus_icon from '../../../assets/pos_plus_icon.png';
import mingcute_department_line from '../../../assets/mingcute_department-line.png';
import vacancy_icon from '../../../assets/vacancy_icon.png';
import position_Icon from '../../../assets/position_Icon.png';
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";


const JobPostingsList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [requisitions, setRequisitions] = useState([
        {
            id: "REQ-2025-00123",
            code: "BOB/HRM/REC/ADVT/2025/06",
            status: "Pending for Indent Approval",
            statusType: "warning",
            departments: 0,
            positions: 0,
            vacancies: 0,
            startDate: "08-06-2025",
            endDate: "29-06-2025",
            editable: true
        },
        {
            id: "REQ-2025-00143",
            code: "BOB/HRM/REC/ADVT/2025/05",
            status: "Approved",
            statusType: "success",
            departments: 1,
            positions: 1,
            vacancies: 16,
            startDate: "05-05-2025",
            endDate: "26-05-2025",
            editable: false
        }
    ]);
    const [openReqId, setOpenReqId] = useState(null);
    const toggleAccordion = (reqId) => {
        setOpenReqId(prev => (prev === reqId ? null : reqId));
    };


    useEffect(() => {
        if (location.state?.newRequisition) {
            setRequisitions(prev => [
                location.state.newRequisition,
                ...prev
            ]);
        }
    }, [location.state]);


    return (
        <Container fluid className="job-postings-page">
            {/* Header */}
            <Row className="mb-3 align-items-center">
                <Col>
                    <h5 className="page-title">All Requisitions</h5>
                </Col>
                <Col className="text-end create">
                    <Button onClick={() => navigate("/job-posting/create-requisition")}>
                        <Plus /> Create New Requisition
                    </Button>
                </Col>
            </Row>

            {/* Filters */}
            <Row className="filters-row g-2 mb-3">
                <Col xs={12} md={2} >
                    <Form.Select className="yearfon">
                        <option>Year - 2025</option>
                    </Form.Select>
                </Col>

                <Col xs={12} md={9}>
                    <div className="search-boxpost">
                        <Search />
                        <Form.Control
                            type="text"
                            placeholder="Search requisitions by ID, Title, or Department..."
                        />
                    </div>
                </Col>

                <Col xs={12} md={1}>
                    <div className="status-dropdown">
                        <Form.Select className="status-select">
                            <option value="">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>All Status</span>
                                </div>
                            </option>
                            <option value="pending">Pending</option>
                            <option value="submitted">Submitted</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </Form.Select>
                    </div>
                </Col>
            </Row>

            {/* Bulk Actions */}
            <Row className="bulk-actions align-items-center mb-3">
                <Col xs={12} md={6}>
                    <Form.Check type="checkbox" label="Select All" className="selectall" />
                </Col>
                <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
                    <Button variant="primary" className="me-2 subbtn">
                        <img src={submitIcon} alt="submitIcon" className='icon-16' /> Submit
                    </Button>
                    <Button variant="outline-secondary canbtn">Cancel</Button>
                </Col>
            </Row>

            {/* Requisition Cards */}
            {requisitions.map((req) => (
                <div key={req.id} className="requisition-card mb-3">
                    <Row
                        className="align-items-center req-clickable"
                        onClick={() => toggleAccordion(req.id)}
                    >


                        <Col xs={12} md={8}>
                            <div className="req-header">
                                <Badge bg="light" text="primary" className="req-id">
                                    {req.id}
                                </Badge>
                                <Badge bg={req.statusType} className="ms-2">
                                    {req.status}
                                </Badge>
                            </div>

                            <div className="d-flex justify-content-between align-items-start">
                                <div className="d-flex align-items-start">
                                    <Form.Check type="checkbox" className="me-2 mt-2" />
                                    <div>
                                        <h6 className="req-code mb-2">{req.code}</h6>
                                        <div className="req-dates">
                                            <div>Start: {req.startDate}</div> |
                                            <div>End: {req.endDate}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="req-meta text-end">
                                    <div><img src={mingcute_department_line} alt="mingcute_department_line" className='icon-16' /> Department - {req.departments}</div>
                                    <div><img src={position_Icon} alt="position_Icon" className='icon-16' /> Positions - {req.positions}</div>
                                    <div><img src={vacancy_icon} alt="vacancy_icon" className='icon-23' /> Vacancies - {req.vacancies}</div>
                                </div>
                            </div>
                        </Col>

                        <Col
                            xs={12}
                            md={4}
                            className="text-md-end mt-3 mt-md-0 actions d-flex justify-content-end align-items-center gap-2"
                        >
                            {req.editable ? (
                                <>
                                    <Button
                                        variant="light"
                                        className="icon-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/job-posting/${req.id}/add-position`);
                                        }}
                                    >
                                        <img src={pos_plus_icon} alt="add" className="icon-16" />
                                    </Button>

                                    <Button
                                        variant="light"
                                        className="icon-btn"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img src={pos_edit_icon} alt="edit" className="icon-20" />
                                    </Button>

                                    <Button
                                        variant="light"
                                        className="icon-btn"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img src={pos_delete_icon} alt="delete" className="icon-20" />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="light"
                                    className="icon-btn"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Eye />
                                </Button>
                            )}

                            {/* 🔽 Accordion Arrow */}
                            <Button
                                variant="none"
                                className="accordion-arrow"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAccordion(req.id);
                                }}
                            >
                                {openReqId === req.id ? <ChevronUp /> : <ChevronDown />}
                            </Button>
                        </Col>
                        {openReqId === req.id && (
                            <div className="accordion-body mt-3">

                                {/* Department Block */}
                                <div className="department-card mb-3">
                                    <div className="department-header d-flex align-items-center gap-2">
                                        <img src={mingcute_department_line} alt="dept" className="icon-16" />
                                        <strong>Digital</strong>
                                        <Badge bg="light" text="primary">1 Position</Badge>
                                    </div>

                                    {/* Position Card */}
                                   <div className="position-card-inner">

  {/* HEADER ROW */}
  <div className="position-header-row">
    <div className="position-title">
      Deputy Manager: Product - Mass Transit System
    </div>

    <div className="position-meta-inline">
      <span>Vacancies: 10</span>
      <span>Age: 24 – 34 Years</span>

      
    </div>
    <Button variant="light" className="icon-btn">
        <img src={pos_edit_icon} alt="edit" className="icon-16" />
      </Button>

      <Button variant="light" className="icon-btn">
        <img src={pos_delete_icon} alt="delete" className="icon-16" />
      </Button>
  </div>

  {/* DETAILS */}
  <div className="position-details">
    <div>
      <strong>Mandatory Education:</strong> Bachelor’s Degree in Computer Science /
      Information Technology or related field.
    </div>
    <div>
      <strong>Preferred Education:</strong> MBA / Finance or related field.
    </div>
  </div>

</div>

                                </div>

                            </div>
                        )}

                    </Row>
                </div>
            ))}
        </Container>
    );
};

export default JobPostingsList;
