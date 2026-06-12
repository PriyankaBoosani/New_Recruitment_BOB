import React from "react";
import {
  FiBriefcase,
  FiFileText,
  FiUserPlus,
  FiUserX,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiAward,
  FiSend,
  FiThumbsUp,
  FiXCircle,
  FiUsers,
} from "react-icons/fi";

import "../../../style/css/Dashboard/CandidatePipelineMetrics.css";

const metricConfig = [
  {
    key: "totalVacancies",
    label: "Total Vacancies",
    icon: <FiBriefcase />,
    color: "red",
  },
  {
    key: "applicationsReceived",
    label: "Applications Received",
    icon: <FiFileText />,
    color: "orange",
  },
  {
    key: "shortlistedCandidates",
    label: "Shortlisted Candidates",
    icon: <FiUserPlus />,
    color: "blue",
  },
  {
    key: "rejectedCandidates",
    label: "Rejected Candidates",
    icon: <FiUserX />,
    color: "red",
  },
  {
    key: "pendingCandidates",
    label: "Pending Candidates",
    icon: <FiClock />,
    color: "yellow",
  },
  {
    key: "interviewsScheduled",
    label: "Interviews Scheduled",
    icon: <FiCalendar />,
    color: "purple",
  },
  {
    key: "interviewsCompleted",
    label: "Interviews Completed",
    icon: <FiCheckCircle />,
    color: "green",
  },
  {
    key: "qualified",
    label: "Qualified",
    icon: <FiAward />,
    color: "cyan",
  },
  {
    key: "offersSent",
    label: "Offers Sent",
    icon: <FiSend />,
    color: "cyan",
  },
  {
    key: "offerAccepted",
    label: "Offer Accepted",
    icon: <FiThumbsUp />,
    color: "green",
  },
  {
    key: "offerRejected",
    label: "Offer Rejected",
    icon: <FiXCircle />,
    color: "red",
  },
  {
    key: "joined",
    label: "Joined",
    icon: <FiUsers />,
    color: "green",
  },
];
const colorMap = {
  red: "rgb(225, 29, 72)",
  orange: "rgb(249, 115, 22)",
  blue: "rgb(37, 99, 235)",
  yellow: "rgb(245, 158, 11)",
  purple: "rgb(139, 92, 246)",
  green: "rgb(16, 185, 129)",
  cyan: "rgb(8, 145, 178)",
};

const CandidatePipelineMetrics = ({ candidatePipeline = {}, onCardClick }) => {
  return (
    <div className="pipeline-wrapper mb-4">
      <div className="pipeline-header">
        <div className="pipeline-header-icon">
          <FiBriefcase />
        </div>

        <div>
          <h2>Candidate Pipeline Metrics</h2>
          <p>Comprehensive candidate journey statistics</p>
        </div>
      </div>

      <div className="pipeline-grid">
        {metricConfig.map((item, index) => (
          <div key={index} className={`metric-card ${item.color}`}>
            <div className={`metric-icon ${item.color}`}>{item.icon}</div>

            <div className="metric-value">
              {candidatePipeline[item.key] ?? 0}
            </div>

            <div className="metric-label">{item.label}</div>

            <div
              className="metric-details-hover"
              style={{
                color: colorMap[item.color],
                cursor: "pointer",
              }}
              onClick={() => onCardClick(item.key)}
            >
              Details →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidatePipelineMetrics;
