import React from "react";
import { useTranslation } from "react-i18next";
import "../../../style/css/MessageCard.css";
import attachment from "../../../assets/attachment.png";

const MessageHistory = ({ item }) => {
  const { t } = useTranslation(["messages", "common"]);

  // 🎨 Random but stable color generator
  const getRandomColor = (seed) => {
    const colors = [
      "#F44336", "#E91E63", "#9C27B0", "#673AB7",
      "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
      "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
      "#FFC107", "#FF9800", "#FF5722"
    ];

    const index = seed
      ? seed.charCodeAt(0) % colors.length
      : Math.floor(Math.random() * colors.length);

    return colors[index];
  };

  return (
    <div className="msg-history">

      <div className="msg-history-title">
        {t("messages:request_history")}
      </div>

      {item.history?.map((hist, index) => {
        const color = getRandomColor(hist.title || hist.comment);

        return (
          <React.Fragment key={index}>
            <div className="msg-history-item">

              {/* Avatar */}
              <div
                className="msg-icon"
                style={{
                  backgroundColor: color + "20",
                  color: color
                }}
              >
                {hist.title?.charAt(0)?.toUpperCase() || "?"}
              </div>

              {/* Content */}
              <div className="flex-grow-1">
                <div
                  className="msg-history-head"
                  style={{ color }}
                >
                  {hist.title}
                </div>

                <div className="msg-history-text">
                  <b>{t("messages:comment")}:</b> {hist.comment}
                </div>

                <div className="msg-history-time">
                  {hist.time}
                </div>
              </div>

              {/* Attachment */}
              {hist.file && (
                <img src={attachment} width={50} height={50} alt="attachment" />
              )}
            </div>

            {index !== item.history.length - 1 && (
              <div className="msg-divider"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MessageHistory;