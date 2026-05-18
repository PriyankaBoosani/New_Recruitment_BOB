import React from "react";
import { useTranslation } from "react-i18next";

const MessageHeader = ({ item, isOpen, onToggle, getStatusClass }) => {
  const { t } = useTranslation(["messages", "common"]);

  return (
    <div
      className="msg-row"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        width: "100%",
        flexWrap: "wrap"
      }}
    >

      {/* LEFT + CENTER CONTENT */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flex: 1,
          flexWrap: "wrap"
        }}
      >

        {/* LEFT */}
        <div
          className="msg-left"
          style={{
            minWidth: "250px",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start"
          }}
        >
          <div className="msg-avatar">
            {item.name
              ?.split(" ")
              .filter(Boolean)
              .map(word => word.charAt(0).toUpperCase())
              .slice(0, 2)
              .join("")}
          </div>

          <div>
            <div className="msg-name">
              {item.name}
            </div>

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

        {/* RIGHT DETAILS */}
        <div
          className="msg-right"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(140px, 1fr))",
            alignItems: "center",
            gap: "16px",
            flex: 1,
            minWidth: "300px"
          }}
        >

          {/* DATE EXTENSION */}
          <div>
            <div className="msg-label">
              Date Extension
            </div>

            <div className="msg-value">
              {item.dateExtension || "-"}
            </div>
          </div>

          {/* POSITION */}
          <div>
            <div className="msg-label">
              {t("common:position")}
            </div>

            <div className="msg-value">
              {item.positionName || "-"}
            </div>
          </div>

          {/* REQUEST TYPE */}
          <div>
            <div className="msg-label">
              {t("messages:request_type")}
            </div>

            <div className="msg-value">
              {item.type || "-"}
            </div>
          </div>

          {/* ZONAL ID */}
          <div>
            <div className="msg-label">
              Zonal ID
            </div>

            <div className="msg-value">
              {item.zonalId || "-"}
            </div>
          </div>

          {/* STATUS */}
          <div
            className="msg-status-wrap"
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <span
              className={`msg-status ${getStatusClass(item.status)}`}
            >
              {item.status || "-"}
            </span>
          </div>

        </div>
      </div>

      {/* ARROW RIGHT SIDE */}
      <div
        className="msg-arrow"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "auto"
        }}
      >
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
  );
};

export default MessageHeader;