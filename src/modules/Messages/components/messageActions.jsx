import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const MessageActions = ({ item, onSubmitApproval }) => {
  const { t } = useTranslation(["messages", "common"]);
  const [comment, setComment] = useState("");

  return (
    <div className="msg-actions">

      {/* Input */}
      <input
        type="text"
        placeholder={t("messages:send_message")}
        className="msg-input form-control"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Accept */}
      <button
        className="btn msg-btn-accept"
        onClick={() =>
          onSubmitApproval(item.id, "L1_PENDING", comment)
        }
      >
        {t("messages:accept")}
      </button>

      {/* Reject */}
      <button
        className="btn btn-outline-secondary msg-btn-reject"
        onClick={() =>
          onSubmitApproval(item.id, "REJECTED", comment)
        }
      >
        {t("messages:reject")}
      </button>

    </div>
  );
};

export default MessageActions;