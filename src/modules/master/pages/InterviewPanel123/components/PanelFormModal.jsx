// components/PanelFormModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import masterApiService from "../../../services/masterApiService";
import { validateInterviewPanelForm } from "../../../../../shared/utils/interviewpanel-validations";

const PanelFormModal = ({ show, onHide, communityOptions, membersOptions, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    community: "",
    members: []
  });
  const [errors, setErrors] = useState({});

  const toggleMember = (name) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(name)
        ? prev.members.filter(m => m !== name)
        : [...prev.members, name]
    }));
  };

  const handleSave = async () => {
    const result = validateInterviewPanelForm(formData);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    const interviewerIds = membersOptions
      .filter(m => formData.members.includes(m.name))
      .map(m => m.id);

    try {
      const payload = {
        interviewPanelsDTO: {
          panelName: formData.name,
          committeeId: formData.community,
          isActive: true
        },
        interviewerIds
      };

      const res = await masterApiService.addInterviewPanel(payload);
      if (!res?.success) throw new Error();

      toast.success("Interview panel created");
      onHide();
      onSuccess();
    } catch {
      toast.error("Save failed");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Interview Panel</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group>
          <Form.Label>Community</Form.Label>
          <Form.Select
            value={formData.community}
            onChange={e => setFormData({ ...formData, community: e.target.value })}
          >
            <option value="">Select</option>
            {communityOptions.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Panel Name</Form.Label>
          <Form.Control
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Members</Form.Label>
          {membersOptions.map(m => (
            <Form.Check
              key={m.id}
              label={m.name}
              checked={formData.members.includes(m.name)}
              onChange={() => toggleMember(m.name)}
            />
          ))}
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PanelFormModal;
