// src/modules/master/pages/InterviewPanel/components/InterviewPanelFormModal.jsx

import React from 'react';
import { Modal, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';
import ErrorMessage from '../../../../../shared/components/ErrorMessage';
import InterviewPanelImportModal from './InterviewPanelImportModal';

const InterviewPanelFormModal = ({
  show,
  onHide,
  isEditing,
  activeTab,
  setActiveTab,
  formData,
  setFormData,
  errors,
  membersOptions,
  handleSave,
  handleImport,
  t,
  ...importProps
}) => {
  const toggleMember = (member) => {
    setFormData(prev => {
      const list = Array.isArray(prev.members) ? [...prev.members] : [];
      return {
        ...prev,
        members: list.includes(member)
          ? list.filter(m => m !== member)
          : [...list, member]
      };
    });
  };

  const removeMember = (e, member) => {
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m !== member)
    }));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <div>
          <Modal.Title>
            {isEditing ? t("edit") : t("added")}
          </Modal.Title>
          <p className="small text-muted para">
            {t("choose_add_method")}
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="p-4">
        {!isEditing && (
          <div className="tab-buttons mb-4">
            <Button
              variant={activeTab === 'manual' ? 'light' : 'outline-light'}
              className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              {t("manual_entry")}
            </Button>

            <Button
              variant={activeTab === 'import' ? 'light' : 'outline-light'}
              className={`tab-button ${activeTab === 'import' ? 'active' : ''}`}
              onClick={() => setActiveTab('import')}
            >
              {t("import_file")}
            </Button>
          </div>
        )}

        {activeTab === 'manual' ? (
          <Form onSubmit={handleSave}>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>
                    {t("panel_name")} <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="form-control-custom"
                  />
                  <ErrorMessage>{errors.name}</ErrorMessage>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>
                    {t("panel_members")} <span className="text-danger">*</span>
                  </Form.Label>

                  <Dropdown autoClose="outside">
                    <Dropdown.Toggle
                      className="form-control-custom d-flex flex-wrap gap-2"
                      style={{ minHeight: 48 }}
                    >
                      {formData.members.length
                        ? formData.members.map(m => (
                            <span key={m} className="pill">
                              {m}
                              <span onClick={(e) => removeMember(e, m)}>×</span>
                            </span>
                          ))
                        : <span className="text-muted">{t("select_members")}</span>}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {membersOptions.map(m => (
                        <Dropdown.Item
                          key={m}
                          onClick={() => toggleMember(m)}
                        >
                          {formData.members.includes(m) ? '✓ ' : ''}{m}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  <ErrorMessage>{errors.members}</ErrorMessage>
                </Form.Group>
              </Col>
            </Row>

            <Modal.Footer className="modal-footer-custom px-0 pt-3 pb-0">
              <Button variant="outline-secondary" onClick={onHide}>
                {t("cancel")}
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? t("update") : t("save")}
              </Button>
            </Modal.Footer>
          </Form>
        ) : (
          <>
            <InterviewPanelImportModal t={t} {...importProps} />
            <Modal.Footer className="modal-footer-custom px-0">
              <Button variant="outline-secondary" onClick={onHide}>
                {t("cancel")}
              </Button>
              <Button variant="primary" onClick={handleImport}>
                {t("import")}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default InterviewPanelFormModal;
