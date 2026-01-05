import React, { useState } from 'react';
import { Modal, Form, Row, Col, Button, Dropdown } from 'react-bootstrap';
import ErrorMessage from '../../../../../shared/components/ErrorMessage';
import InterviewPanelImportModal from './InterviewPanelImportModal';

const InterviewPanelFormModal = ({ 
  show, onHide, formData, setFormData, errors, 
  communityOptions, membersOptions, panels,   // 👈 add panels
  editAssignedMembers, isViewing, isEditing, onSave, t 
}) => {
  const [activeTab, setActiveTab] = useState('manual');

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleMember = (member) => {
    const name = member.name;
    setFormData(prev => {
      const exists = prev.members.includes(name);
      return {
        ...prev,
        members: exists ? prev.members.filter(m => m !== name) : [...prev.members, name]
      };
    });
  };
const globallyAssignedMembers = new Set();

panels.forEach(panel => {
  (panel.memberNames || []).forEach(name => {
    globallyAssignedMembers.add(name);
  });
});
  // const availableMembers = membersOptions.filter(m => 
  //   !isEditing ? !m.assigned : (!m.assigned || editAssignedMembers.includes(m.name))
  // );
const availableMembers = membersOptions.filter(member => {
  if (isEditing) {
    // EDIT MODE:
    // allow unassigned + members already in this panel
    return (
      !globallyAssignedMembers.has(member.name) ||
      editAssignedMembers.includes(member.name)
    );
  }

  // ADD MODE:
  // allow only unassigned members
  return !globallyAssignedMembers.has(member.name);
});

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="user-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <div>
        <Modal.Title>
        {isViewing ? t("view") : isEditing ? t("edit") : t("added")}
      </Modal.Title>

                    {!isEditing && !isViewing && (
              <p className="mb-0 small text-muted para">
                {t("choose_add_method")}
              </p>
            )}

        </div>
      </Modal.Header>
      <Modal.Body className="p-4">
       {!isEditing && !isViewing && (
          <div className="tab-buttons mb-4">
            <Button
              className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
              variant={activeTab === 'manual' ? 'light' : 'outline-light'}
              onClick={() => setActiveTab('manual')}
            >
              {t("manual_entry")}
            </Button>

            <Button
              className={`tab-button ${activeTab === 'import' ? 'active' : ''}`}
              variant={activeTab === 'import' ? 'light' : 'outline-light'}
              onClick={() => setActiveTab('import')}
            >
              {t("import_file")}
            </Button>
          </div>
        )}

        {activeTab === 'manual' ? (
         <Form
        onSubmit={
          isViewing
            ? (e) => {
                e.preventDefault();
                onHide();
              }
            : onSave
        }
      >

            <Row className="g-3">
             <Col xs={12}>
  <Form.Group>
    <Form.Label>
       {t("committee")}<span className="text-danger">*</span>
    </Form.Label>

    {isViewing ? (
      <div className="form-control-view">
        {communityOptions.find(c => c.id === formData.community)?.name || "-"}
      </div>
    ) : (
      <Form.Select
        name="community"
        value={formData.community}
        onChange={handleInput}
      >
       <option value="">{t("select_community")}</option>
        {communityOptions.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Form.Select>
    )}

    {!isViewing && <ErrorMessage>{errors.community}</ErrorMessage>}
  </Form.Group>
</Col>

            <Col xs={12}>
  <Form.Group>
    <Form.Label>
      {t("panel_name")} <span className="text-danger">*</span>
    </Form.Label>

    {isViewing ? (
      <div className="form-control-view">
        {formData.name || "-"}
      </div>
    ) : (
      <Form.Control
        name="name"
        value={formData.name}
        onChange={handleInput}
         placeholder={t("enter_panel_name")} 
      />
    )}

    {!isViewing && <ErrorMessage>{errors.name}</ErrorMessage>}
  </Form.Group>
</Col>

             <Col xs={12}>
  <Form.Group>
    <Form.Label>
      {t("panel_members")} <span className="text-danger">*</span>
    </Form.Label>

    {isViewing ? (
      <div className="form-control-view d-flex flex-wrap gap-2">
        {formData.members.length > 0
          ? formData.members.map(m => (
              <span key={m} className="badge bg-light text-dark p-2">
                {m}
              </span>
            ))
          : "-"}
      </div>
    ) : (
      <>
        <Dropdown autoClose="outside">
          <Dropdown.Toggle className="form-control-custom d-flex align-items-center justify-content-between buttonnonebg">
            <div className="d-flex flex-wrap gap-2">
              {formData.members.length > 0
                ? formData.members.map(m => (
                    <span key={m} className="badge bg-light text-dark p-2">{m}</span>
                  ))
                : <span className="text-muted">{t("select_members")}</span>}
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="w-100 shadow" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {availableMembers.map(m => (
              <Dropdown.Item key={m.id} onClick={() => toggleMember(m)}>
                {formData.members.includes(m.name) ? "✓ " : ""}{m.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <ErrorMessage>{errors.members}</ErrorMessage>
      </>
    )}
  </Form.Group>
</Col>

            </Row>
           <Modal.Footer className="px-0 pb-0 mt-3">
  <Button variant="outline-secondary" onClick={onHide}>
    {isViewing ? t("close") : t("cancel")}
  </Button>

  {!isViewing && (
    <Button variant="primary" type="submit">
      {isEditing ? t("update") : t("save")}
    </Button>
  )}
</Modal.Footer>

          </Form>
        ) : (
          <InterviewPanelImportModal
            show={activeTab === 'import'}
            onHide={onHide}
            t={t}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default InterviewPanelFormModal;