import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const MessageActions = ({ item, onSubmitApproval }) => {
  const { t } = useTranslation(["messages", "common"]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const status = (item.status || "").toUpperCase();

  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";

  return (
    <div className="msg-actions d-flex align-items-start gap-2">

      {/* ✅ Wrap input + error */}
      <div style={{ flex: 1 }}>
        
        {/* Input */}
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

        {/* ✅ Error BELOW input */}
        {error && (
          <small className="text-danger d-block mt-1">
            {error}
          </small>
        )}
      </div>

      {/* ACCEPT */}
      <button
        className="btn msg-btn-accept"
        disabled={!isPending}
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
        disabled={isRejected}
        onClick={async () => {
          if (!comment.trim()) {
            setError("This field is required");
            return;
          }

          await onSubmitApproval(item.id, "REJECTED", comment);
          setComment("");
          setError("");
        }}
      >
        {t("messages:reject")}
      </button>

    </div>
  );
};

export default MessageActions;