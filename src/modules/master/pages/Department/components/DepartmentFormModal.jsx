import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ErrorMessage from '../../../../../shared/components/ErrorMessage';
import DepartmentImportView from '../components/DepartmentImportModal';

const DepartmentFormModal = ({
  show, onHide, isEditing, activeTab, setActiveTab, formData, handleInputChange, errors, handleSave, handleImport, t, ...importProps
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <div>
          <Modal.Title>{isEditing ? t("editDepartment") : t("addDepartment")}</Modal.Title>
          <p className="mb-0 small text-muted para">{t("choose_add_method")}</p>
        </div>
      </Modal.Header>
      <Modal.Body className="p-4">
        {!isEditing && (
          <div className="tab-buttons mb-4">
            <Button className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
              variant={activeTab === 'manual' ? 'light' : 'outline-light'} onClick={() => setActiveTab('manual')}>{t("manual_entry")}</Button>
            <Button className={`tab-button ${activeTab === 'import' ? 'active' : ''}`} variant={activeTab === 'import' ? 'light' : 'outline-light'} onClick={() => setActiveTab('import')}>{t("import_file")}</Button>
          </div>
        )}

        {activeTab === 'manual' ? (
          <Form onSubmit={handleSave}>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group className="form-group">
                  <Form.Label>{t("name")} *</Form.Label>
                  <Form.Control name="name" className="form-control-custom" value={formData.name} onChange={handleInputChange} placeholder={t("department:enterName")} />
                  <ErrorMessage>{errors.name}</ErrorMessage>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="form-group">
                  <Form.Label>{t("description")} *</Form.Label>
                  <Form.Control  className="form-control-custom" as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder={t("department:enterDescription")} />
                  <ErrorMessage>{errors.description}</ErrorMessage>
                </Form.Group>
              </Col>
            </Row>
            <Modal.Footer className="px-0 pt-3 pb-0 modal-footer-custom">
              <Button variant="outline-secondary" onClick={onHide}>{t("cancel")}</Button>
              <Button variant="primary" type="submit">{isEditing ? t("updateDepartment") : t("save")}</Button>
            </Modal.Footer>
          </Form>
        ) : (
          <>
            <DepartmentImportView t={t} {...importProps} />
            <Modal.Footer className="px-0 modal-footer-custom">
              <Button variant="outline-secondary" onClick={onHide}>{t("cancel")}</Button>
              <Button variant="primary" onClick={handleImport}>{t("import")}</Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DepartmentFormModal;