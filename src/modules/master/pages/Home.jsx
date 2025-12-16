import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="mt-5">
      <Card className="text-center p-4 shadow">
        <Card.Body>
          <h1 className="display-4 mb-4">Welcome to Bob App</h1>
          <p className="lead">
            This is a modern React application with Bootstrap 5 and a well-organized folder structure.
          </p>
          <div className="mt-4">
            <Button variant="primary" size="lg" className="me-2">
              Get Started
            </Button>
            <Button variant="outline-secondary" size="lg">
              Learn More
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Home;
