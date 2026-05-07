import React from "react";
import "../../../style/css/MessageCard.css";

import MessageHeader from "../../Messages/components/messageHeader.jsx";
import MessageHistory from "../../Messages/components/messageHistory.jsx";
import MessageActions from "../../Messages/components/messageActions.jsx";
import { useMessages } from '../../Messages/hooks/useMessages.js';
import { useTranslation } from "react-i18next";

const MessageCard = ({ item, isOpen, onToggle, onSubmitApproval }) => {
  const { t } = useTranslation(["messages", "common"]);
  const { getStatusClass, getHistoryColor } = useMessages();

  return (
    <div className="msg-card" id="msg-card-1">

      <MessageHeader
        item={item}
        isOpen={isOpen}
        onToggle={onToggle}
        getStatusClass={getStatusClass}
      />

      {isOpen && (
        <div className="msg-expand">

          <MessageHistory
            item={item}
            getHistoryColor={getHistoryColor}
          />

          <MessageActions
            item={item}
            onSubmitApproval={onSubmitApproval}
          />

        </div>
      )}
    </div>
  );
};

export default MessageCard;