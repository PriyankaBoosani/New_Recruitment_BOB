import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";

const DynamicField = ({
  field,
  updateField,
  removeField,
  addOption,
  updateOption,
  removeOption,
}) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Row className="align-items-center">

          <Col md={5}>
            <Form.Group>
              <Form.Label>
                Label <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                value={field.label}
                placeholder="Enter Label"
                onChange={(e) =>
                  updateField(field.id, "label", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Required</Form.Label>

              <Form.Check
                type="switch"
                checked={field.required}
                onChange={(e) =>
                  updateField(
                    field.id,
                    "required",
                    e.target.checked
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4} className="text-end">
            <Button
              variant="outline-danger"
              onClick={() => removeField(field.id)}
            >
              Delete Field
            </Button>
          </Col>

        </Row>

        {/* TEXTBOX */}

        {field.type === "text" && (
          <Row className="mt-3">

            <Col md={6}>
              <Form.Group>
                <Form.Label>Placeholder</Form.Label>

                <Form.Control
                  value={field.placeholder}
                  placeholder="Enter Placeholder"
                  onChange={(e) =>
                    updateField(
                      field.id,
                      "placeholder",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Character Limit</Form.Label>

                <Form.Control
                  type="number"
                  min={1}
                  value={field.maxLength}
                  onChange={(e) =>
                    updateField(
                      field.id,
                      "maxLength",
                      Number(e.target.value)
                    )
                  }
                />
              </Form.Group>
            </Col>

          </Row>
        )}

        {/* DROPDOWN */}

        {field.type === "dropdown" && (
          <div className="mt-3">

            <Form.Label>Dropdown Options</Form.Label>

            {field.options.map((option, index) => (
              <Row key={index} className="mb-2">

                <Col md={10}>
                  <Form.Control
                    value={option}
                    placeholder={`Option ${index + 1}`}
                    onChange={(e) =>
                      updateOption(
                        field.id,
                        index,
                        e.target.value
                      )
                    }
                  />
                </Col>

                <Col md={2}>
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      removeOption(field.id, index)
                    }
                  >
                    X
                  </Button>
                </Col>

              </Row>
            ))}

            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => addOption(field.id)}
            >
              + Add Option
            </Button>

          </div>
        )}

        {/* DATE */}

        {field.type === "date" && (
          <div className="mt-3">

            <Form.Text className="text-muted">
              Date field will display a calendar while filling the form.
            </Form.Text>

          </div>
        )}

      </Card.Body>
    </Card>
  );
};

export default DynamicField;