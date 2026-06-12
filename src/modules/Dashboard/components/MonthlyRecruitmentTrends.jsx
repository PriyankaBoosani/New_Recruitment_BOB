import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { FiTrendingUp } from "react-icons/fi";
import "../../../style/css/Dashboard/MonthlyRecruitmentTrends.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="monthly-tooltip">
      <div className="tooltip-month">{label}</div>

      {payload.map((entry, index) => (
        <div key={index} className="tooltip-row">
          <div className="tooltip-left">
            <span
              className="tooltip-dot"
              style={{
                background: entry.color,
              }}
            />

            <span className="tooltip-text">{entry.name}:</span>
          </div>

          <span className="tooltip-value">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const MonthlyRecruitmentTrends = ({ monthlyTrends = [] }) => {
  return (
    <div className="monthly-trends-card mb-4">
      <div className="monthly-trends-header">
        <div className="monthly-trends-icon">
          <FiTrendingUp />
        </div>

        <div>
          <h2>Monthly Recruitment Trends</h2>
          <p>Jan - Dec 2024 performance overview</p>
        </div>
      </div>
      <div className="monthly-trends-legend">
        <div className="legend-item">
          <span className="legend-line" style={{ background: "#0D3B94" }} />
          <span className="legend-text">Candidate Registrations</span>
        </div>

        <div className="legend-item">
          <span className="legend-line" style={{ background: "#1482BE" }} />
          <span className="legend-text">Interviews Completed</span>
        </div>

        <div className="legend-item">
          <span className="legend-line" style={{ background: "#D90429" }} />
          <span className="legend-text">Requisitions Created</span>
        </div>

        <div className="legend-item">
          <span className="legend-line" style={{ background: "#0F9D58" }} />
          <span className="legend-text">Offers Sent</span>
        </div>
      </div>

      <div className="monthly-chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="4 4" />

            <XAxis dataKey="month" axisLine={false} tickLine={false} />

            <YAxis axisLine={false} tickLine={false} />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#94a3b8",
                strokeDasharray: "4 4",
                strokeWidth: 1,
              }}
            />

            <Line
              name="Candidate Registrations"
              type="monotone"
              dataKey="registrations"
              stroke="#0D3B94"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "#0D3B94",
                stroke: "#0D3B94",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "#0D3B94",
                stroke: "#0D3B94",
                strokeWidth: 2,
              }}
            />

            <Line
              name="Interviews Completed"
              type="monotone"
              dataKey="interviews"
              stroke="#1482BE"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "#1482BE",
                stroke: "#1482BE",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "#1482BE",
                stroke: "#1482BE",
                strokeWidth: 2,
              }}
            />

            <Line
              name="Requisitions Created"
              type="monotone"
              dataKey="requisitions"
              stroke="#D90429"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "#D90429",
                stroke: "#D90429",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "#D90429",
                stroke: "#D90429",
                strokeWidth: 2,
              }}
            />

            <Line
              name="Offers Sent"
              type="monotone"
              dataKey="offers"
              stroke="#0F9D58"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "#0F9D58",
                stroke: "#0F9D58",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "#0F9D58",
                stroke: "#0F9D58",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyRecruitmentTrends;
