import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";

const MessageActions = ({ item, onSubmitApproval }) => {
  const { t } = useTranslation(["messages", "common"]);

  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // FIXED STATUS FORMAT
  const status = (item.status || "")
    .toUpperCase()
    .replace(/\s+/g, "_");

  /* SHOW BUTTONS */
  const showAccept =
    status === "PENDING" ||
    status === "L1_PENDING";

  const showReject =
    status === "PENDING" ||
    status === "L1_PENDING";

  /* ENABLE/DISABLE BUTTONS */
  const disableAccept = status === "L1_PENDING";

  /* REJECT ALWAYS ENABLED */
  const disableReject = false;

  /* HIDE BUTTONS + COMMENT FIELD */
  const hideActions = [
    "REJECTED",
    "L1_APPROVED",
    "L1_REJECTED",
    "APPROVED",
    "L2_REJECTED"
  ].includes(status);

  // Reject handler
  const handleRejectConfirm = async () => {
    await onSubmitApproval(
      item.id,
      "REJECTED",
      comment
    );

    setShowRejectModal(false);
    setComment("");
    setError("");
  };

  return (
    <>
      {!hideActions && (
        <div className="msg-actions d-flex align-items-start gap-2">

          {/* COMMENT FIELD */}
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder={t("messages:send_message")}
              className={`msg-input form-control ${error ? "is-invalid" : ""
                }`}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);

                if (e.target.value.trim()) {
                  setError("");
                }
              }}
            />

            {error && (
              <small className="text-danger d-block mt-1">
                {error}
              </small>
            )}
          </div>

          {/* ACCEPT BUTTON */}
          {showAccept && (
            <button
              className="btn msg-btn-accept"
              disabled={disableAccept}
              onClick={async () => {
                if (!comment.trim()) {
                  setError("This field is required");
                  return;
                }

                await onSubmitApproval(
                  item.id,
                  "L1_PENDING",
                  comment
                );

                setComment("");
                setError("");
              }}
            >
              {t("messages:accept")}
            </button>
          )}

          {/* REJECT BUTTON */}
          {showReject && (
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
          )}

        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {!hideActions && (
        <Modal
          show={showRejectModal}
          onHide={() => setShowRejectModal(false)}
          centered
          dialogClassName="del-modal"
        >
          <Modal.Body className="del-body">

            {/* HEADER */}
            <div className="del-header">
              <div className="del-title">
                Confirm Reject
              </div>

              <button
                className="del-close"
                onClick={() => setShowRejectModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* MESSAGE */}
            <div className="del-message">
              Are you sure you want to reject?

              <div className="text-muted small mt-2">
                Reason: {comment}
              </div>
            </div>

            {/* FOOTER */}
            <div className="del-footer">

              <button
                className="del-cancel"
                onClick={() => setShowRejectModal(false)}
              >
                {t("common:cancel")}
              </button>

              <button
                className="del-delete"
                onClick={handleRejectConfirm}
              >
                {t("messages:reject")}
              </button>

            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default MessageActions;