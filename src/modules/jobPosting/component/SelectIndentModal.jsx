import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const SelectIndentModal = ({
  show,
  onClose,
  data,
  onSelect,
  selectedIndent
}) => {
  const [selected, setSelected] = useState(null);

  // 🔥 Preselect when modal opens
  useEffect(() => {
    if (show) {
      setSelected(selectedIndent || "CUSTOM");
    }
  }, [show, selectedIndent]);

  return (
    <Modal show={show} onHide={onClose} centered className="selectindent">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="bluecol f16">Select Indent</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* 🔥 Upload New */}
        <div
          className={`p-1 ps-0 cursor-pointer ${
            selected === "CUSTOM" ? "rounded" : ""
          }`}
          onClick={() => setSelected("CUSTOM")}
        >
          <Form.Check
            type="radio"
            name="indent"
            checked={selected === "CUSTOM"}
            onChange={() => setSelected("CUSTOM")}
            label={<span className="text-muted small">Upload New Indent</span>}
          />
        </div>

        {/* 🔥 Existing Section */}
        {data?.length > 0 && (
          <>
            <div className="mt-3 mb-2 fw-semibold text-muted small bluecol">
              Existing Indents
            </div>

            {data.map((item, index) => (
              <div
                key={item.positionId}
                className={`p-1 ps-0 cursor-pointer ${
                  selected?.positionId === item.positionId
                    ? "rounded"
                    : ""
                }`}
                onClick={() => setSelected(item)}
              >
                <Form.Check
                  type="radio"
                  name="indent"
                  checked={selected?.positionId === item.positionId}
                  onChange={() => setSelected(item)}
                  label={
                    <div>
                      <div className="text-muted small">
                        {item.indentName || `Indent ${index + 1}`}
                      </div>
                     
                    </div>
                  }
                />
              </div>
            ))}
          </>
        )}

        {data?.length === 0 && (
          <div className="text-muted mt-2">
            No existing indents available
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={() => onSelect(selected)}
          disabled={!selected}
        >
          Select
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectIndentModal;