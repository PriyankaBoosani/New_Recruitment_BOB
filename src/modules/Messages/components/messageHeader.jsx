import React from "react";
import { useTranslation } from "react-i18next";

const MessageHeader = ({ item, isOpen, onToggle, getStatusClass }) => {
  const { t } = useTranslation(["messages", "common"]);

  
  return (
    <div
      className="msg-row"
    
    >

      {/* LEFT */}
      <div className="msg-left">
        <div className="msg-avatar">
          {item.name
            ?.split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <div className="msg-name">{item.name}</div>

          <div className="msg-sub">
            {t("messages:reg_no")}: {item.regNo}
          </div>

          <div className="msg-sub">
            <i className="bi bi-calendar3"></i>{" "}
            {item.date || "-"} {" | "}
            <i className="bi bi-clock ms-1"></i>{" "}
            {item.time || "-"}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="msg-right">

        <div>
          <div className="msg-label">
            {t("messages:requisition")}
          </div>
          <div className="msg-value">
            {item.requisitionName || "-"}
          </div>
        </div>

        <div>
          <div className="msg-label">
            {t("common:position")}
          </div>
          <div className="msg-value">
            {item.positionName || "-"}
          </div>
        </div>

        <div>
          <div className="msg-label">
            {t("messages:request_type")}
          </div>
          <div className="msg-value">
            {item.type || "-"}
          </div>
        </div>

        {/* STATUS */}
        <div className="msg-status-wrap" style={{ justifyContent: "center", alignItems: "center", display: "inherit" }}>
          <span className={`msg-status ${getStatusClass(item.status)}`}>
            {item.status || "-"}
          </span>
        </div>

        {/* ARROW */}
        <div className="msg-arrow" style={{ justifyContent: "center", alignItems: "center", display: "inherit" }}>
          <button
            type="button"
            className={`msg-arrow-btn ${isOpen ? "open" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.id);
            }}
          >
            <i className="bi bi-chevron-down"></i>
          </button>
        </div>

      </div>
    </div>
  );
};

export default MessageHeader;