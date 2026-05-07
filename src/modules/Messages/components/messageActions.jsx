import React from "react";
import { useTranslation } from "react-i18next";

const MessageActions = () => {
  const { t } = useTranslation(["messages", "common"]);

  return (
    <div className="msg-actions">
      <input
        type="text"
        placeholder={t("messages:send_message")}
        className="msg-input form-control"
      />

      <button className="btn msg-btn-accept">
        {t("messages:accept")}
      </button>

      <button className="btn btn-outline-secondary msg-btn-reject">
        {t("messages:reject")}
      </button>
    </div>
  );
};

export default MessageActions;