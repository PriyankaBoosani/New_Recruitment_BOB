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

            {/* NAME + HISTORY ICON */}
            <div
              className="msg-name"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>{item.name}</span>

              <button
                type="button"
                className="btn btn-link p-0 border-0"
                title="Approval History"
                onClick={(e) => {
                  e.stopPropagation();

                  item.onHistoryClick?.();
                }}
              >
                <i
                  className="bi bi-clock-history"
                  style={{
                    fontSize: "16px",
                    color: "#6B7280",
                    cursor: "pointer"
                  }}
                ></i>
              </button>
            </div>

            {/* REG NO */}
            <div className="msg-sub">
              {t("messages:reg_no")}: {item.regNo}
            </div>

            {/* DATE + TIME */}
            <div className="msg-sub">

              <i
                className="bi bi-calendar3"
                style={{
                  color: "#6B7280",
                  fontSize: "14px"
                }}
              ></i>{" "}

              {item.date || "-"} {" | "}

              <i
                className="bi bi-clock ms-1"
                style={{
                  color: "#6B7280",
                  fontSize: "14px"
                }}
              ></i>{" "}

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
              "repeat(auto-fit, minmax(180px, 1fr))",
            alignItems: "start",
            columnGap: "10px",
            rowGap: "20px",
            flex: 1,
            minWidth: "300px"
          }}
        >

          {/* DATE EXTENSION */}
          <div>

            <div
              className="msg-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "22px"
              }}
            >
              <i className="bi bi-calendar-event"></i>

              <span>Extension Date</span>
            </div>

            <div className="msg-value">
              {item.dateExtension || "-"}
            </div>

          </div>

          {/* POSITION */}
          <div>

            <div
              className="msg-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "22px"
              }}
            >
              <i className="bi bi-briefcase"></i>

              <span>{t("common:position")}</span>
            </div>

            <div className="msg-value">
              {item.positionName || "-"}
            </div>

          </div>

          {/* REQUEST TYPE */}
          <div>

            <div
              className="msg-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "22px"
              }}
            >
              <i className="bi bi-grid"></i>

              <span>{t("messages:request_type")}</span>
            </div>

            <div className="msg-value">
              {item.type || "-"}
            </div>

          </div>

          {/* ZONAL ID */}
          <div>

            <div
              className="msg-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "22px"
              }}
            >
              <i className="bi bi-geo-alt"></i>

              <span>Zonal</span>
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
              alignItems: "center",
              marginTop: "22px"
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