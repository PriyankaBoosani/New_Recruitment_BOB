import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../../style/css/Stepper.css";

const steps = [
  { key: "REQUISITION", label: "Requisition" },
  { key: "UPLOAD_INDENT", label: "Upload Indent" },
  { key: "POSITIONS", label: "Positions" },
  { key: "AGE_RELAXATION", label: "Age Relaxation" }
];

const Stepper = ({ currentStep }) => {
  const activeIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <Container fluid className="stepper-container">
      <Row className="stepper-row">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;
          const stepNumber = index + 1;

          return (
            <React.Fragment key={step.key}>
              <Col className="step-col">
                <div className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="step-number">
                    {isCompleted ? (
                      <span className="checkmark">✓</span>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <div className="step-label">{step.label}</div>
                </div>
              </Col>
              {index < steps.length - 1 && <div className="step-connector" />}
            </React.Fragment>
          );
        })}
      </Row>
    </Container>
  );
};

export default Stepper;