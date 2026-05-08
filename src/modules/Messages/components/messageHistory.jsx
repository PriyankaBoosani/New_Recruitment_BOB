import React from "react";
import { useTranslation } from "react-i18next";
import "../../../style/css/MessageCard.css";
import attachment from "../../../assets/attachment.png";

const MessageHistory = ({ item }) => {
  const { t } = useTranslation(["messages", "common"]);

  // 🎯 Detect role from title
  const getColorByTitle = (title) => {
    const text = title?.toLowerCase() || "";

    if (text.includes("candidate")) {
      return "#42579f";  
    }
    if (text.includes("recruiter") || text.includes("approved") || text.includes("rejected")) {
      return "#f26522";  
    }

    return "#42579f";
  };

  return (
    <div className="msg-history">

      <div className="msg-history-title">
        {t("messages:request_history")}
      </div>

      {item.history?.map((hist, index) => {
        console.log("History item:", hist);

        // ✅ COLOR BASED ON TITLE
        const color = getColorByTitle(hist.title);

        return (
          <React.Fragment key={index}>
            <div className="msg-history-item">

              {/* Avatar */}
              <div
                className="msg-icon"
                style={{
                  backgroundColor: color,  
                  color: "#fff"            
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