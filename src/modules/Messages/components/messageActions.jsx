import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";

const MessageActions = ({ item, onSubmitApproval }) => {
  const { t } = useTranslation(["messages", "common"]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const status = (item.status || "").toUpperCase();
  const isRejected = status === "REJECTED";

  // ✅ Confirm Reject API call
  const handleRejectConfirm = async () => {
    await onSubmitApproval(item.id, "REJECTED", comment);
    setShowRejectModal(false);
    setComment("");
    setError("");
  };

  return (
    <>
      <div className="msg-actions d-flex align-items-start gap-2">

        {/* INPUT */}
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder={t("messages:send_message")}
            className={`msg-input form-control ${error ? "is-invalid" : ""}`}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            disabled={isRejected}
          />

          {error && (
            <small className="text-danger d-block mt-1">
              {error}
            </small>
          )}
        </div>

        {/* ACCEPT */}
        <button
          className="btn msg-btn-accept"
          disabled={isRejected}
          onClick={async () => {
            if (!comment.trim()) {
              setError("This field is required");
              return;
            }

            await onSubmitApproval(item.id, "L1_PENDING", comment);
            setComment("");
            setError("");
          }}
        >
          {t("messages:accept")}
        </button>

        {/* ✅ REJECT (VALIDATION FIRST → THEN POPUP) */}
        <button
          className="btn btn-outline-secondary msg-btn-reject"
          disabled={isRejected}
          onClick={() => {
            if (!comment.trim()) {
              setError("This field is required"); // ❌ validation first
              return;
            }

            setShowRejectModal(true); // ✅ open popup only if valid
          }}
        >
          {t("messages:reject")}
        </button>
      </div>

      {/* ✅ REJECT CONFIRMATION MODAL */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reject</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to reject?</p>

          <div className="text-muted small">
            Reason: {comment}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowRejectModal(false)}
          >
            Cancel
          </button>

          <button
            className="btn btn-danger"
            onClick={handleRejectConfirm}
          >
            Confirm Reject
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MessageActions;