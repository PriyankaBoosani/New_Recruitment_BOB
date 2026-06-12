import React from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCheckCircle,
  FiBriefcase,
} from "react-icons/fi";
import "../../../style/css/Dashboard/CandidateRegistrationOverview.css";

const CandidateRegistrationOverview = ({ data }) => {
  const steps = [
    {
      value: data?.totalCandidates ?? 0,
      label: "Total Candidates",
      color: "#0f3b96",
      border: "#bfd7ff",
      bg: "#eef4ff",
      icon: <FiUsers />,
    },
    {
      value: data?.registeredOnly ?? 0,
      label: "Registered Only",
      color: "#7c3aed",
      border: "#e7d8ff",
      bg: "#f5f0ff",
      icon: <FiUserCheck />,
    },
    {
      value: data?.profileCompleted ?? 0,
      label: "Profile Completed",
      color: "#059669",
      border: "#c7f0dd",
      bg: "#edfdf5",
      icon: <FiCheckCircle />,
    },
    {
      value: data?.appliedCandidates ?? 0,
      label: "Applied Candidates",
      color: "#d90429",
      border: "#ffd1d8",
      bg: "#fff1f3",
      icon: <FiBriefcase />,
    },
  ];

  return (
    <div className="candidate-overview-card">
      <div className="candidate-header">
        <div className="candidate-header-icon">
          <FiUsers />
        </div>

        <div>
          <h3>Candidate Registration Overview</h3>
          <p>Candidate funnel & progression</p>
        </div>
      </div>

      <div className="candidate-flow">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            <div
              className="candidate-step"
              style={{
                borderColor: step.border,
              }}
            >
              <div
                className="step-icon"
                style={{
                  background: step.bg,
                  color: step.color,
                }}
              >
                {step.icon}
              </div>

              <div
                className="step-value"
                style={{
                  color: step.color,
                }}
              >
                {step.value.toLocaleString()}
              </div>

              <div className="step-label">{step.label}</div>
            </div>

            {index !== steps.length - 1 && (
              <div className="flow-arrow">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CandidateRegistrationOverview;