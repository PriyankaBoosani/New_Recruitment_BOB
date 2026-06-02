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

  const disableAccept =
    status === "REJECTED" ||
    status === "L1 PENDING" ||
    status === "L2 PENDING" ||
    status === "L2 REJECTED" ||
    status === "L1 APPROVED" ||
    status === "L2 APPROVED";

  const disableReject =
    status === "REJECTED" ||
    status === "L2 PENDING" ||
    status === "L2 REJECTED" ||
    status === "L1 APPROVED" ||
    status === "L2 APPROVED";

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

          {error && <small className="text-danger d-block mt-1">{error}</small>}
        </div>

        {/* ACCEPT */}
        <button
          className="btn msg-btn-accept"
          disabled={disableAccept}
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

        {/* REJECT */}
        <button
          className="btn btn-outline-secondary msg-btn-reject"
          disabled={disableReject}
          onClick={() => {
            if (!comment.trim()) {
              setError("This field is required");
              return;
            }

            setShowRejectModal(true);
          }}
        >
          {t("messages:reject")}
        </button>
      </div>

      {/* REJECT CONFIRMATION MODAL */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        centered
        dialogClassName="del-modal"
      >
        <Modal.Body className="del-body">
          {/* HEADER */}
          <div className="del-header">
            <div className="del-title">Confirm Reject</div>

            <button className="del-close" onClick={() => setShowRejectModal(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* MESSAGE */}
          <div className="del-message">
            Are you sure you want to reject?
            <div className="text-muted small mt-2">Reason: {comment}</div>
          </div>

          {/* FOOTER */}
          <div className="del-footer">
            <button className="del-cancel" onClick={() => setShowRejectModal(false)}>
              {t("common:cancel")}
            </button>

            <button className="del-delete" onClick={handleRejectConfirm}>
              {t("messages:reject")}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MessageActions;
