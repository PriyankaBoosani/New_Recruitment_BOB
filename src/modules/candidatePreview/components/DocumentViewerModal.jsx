import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "../../../style/css/PreviewModal.css";

const DocumentViewerModal = ({
  show,
  onHide,
  document,
  onVerify,
  onReject,
}) => {
  const [comment, setComment] = useState("");

  if (!document) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="doc-viewer-dialog"
    >
      <div className="doc-viewer-container">

        {/* ===== HEADER ===== */}
        <div className="doc-viewer-header">
          <span className="doc-viewer-title">
            {document.name}
          </span>

          <button
            className="doc-viewer-close"
            onClick={onHide}
          >
            ×
          </button>
        </div>

        {/* ===== PDF VIEWER ===== */}
        <div className="doc-viewer-content">
          <iframe
            src={`${document.url}#toolbar=0&navpanes=0&scrollbar=1`}
            title={document.name}
            className="doc-pdf-frame"
          />
        </div>

        {/* ===== FOOTER ===== */}
        <div className="doc-viewer-footer">
          <input
            type="text"
            placeholder="Enter comments..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="doc-viewer-actions">
            <button
              className="btn-reject"
              onClick={() => onReject(comment)}
            >
              Rejected
            </button>

            <button
              className="btn-verify"
              onClick={() => onVerify(comment)}
            >
              Verified
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default DocumentViewerModal;
