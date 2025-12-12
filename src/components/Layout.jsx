import React, { Suspense } from 'react';
import { Container, Row, Col, Spinner, InputGroup, Form } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

const Layout = ({ children }) => (
  <Suspense fallback={<Loading />}>
    <div className="d-flex flex-column vh-100">
      <div className="flex-grow-1 d-flex" style={{ overflow: 'hidden' }}>
        <main className="flex-grow-1" style={{ overflowY: 'auto', background: '#eee', overflowX: 'hidden' }}>
         
          <Container fluid className="h-100">
            <Row className="h-100">
              <Col className="p-0" style={{ borderRight: '1px solid #dee2e6' }}>
                <Outlet />
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  </Suspense>
);

export default Layout;