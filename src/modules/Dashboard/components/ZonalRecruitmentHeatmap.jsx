import React, { useState } from "react";
import { FiMapPin, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../../../style/css/Dashboard/ZonalRecruitmentHeatmap.css";

const ZonalRecruitmentHeatmap = ({ zonalHeatmap = [] }) => {
  const cardsPerView = 6;

  const [startIndex, setStartIndex] = useState(0);

  const visibleZones = zonalHeatmap.slice(
    startIndex,
    startIndex + cardsPerView
  );

  const showLeftArrow = startIndex > 0;

  const showRightArrow = startIndex + cardsPerView < zonalHeatmap.length;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - cardsPerView, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + cardsPerView, zonalHeatmap.length - cardsPerView)
    );
  };
  const totalCandidates = zonalHeatmap.reduce(
    (sum, zone) => sum + zone.candidates,
    0
  );

  const totalOffered = zonalHeatmap.reduce(
    (sum, zone) => sum + zone.offered,
    0
  );

  const totalRejected = zonalHeatmap.reduce(
    (sum, zone) => sum + zone.rejected,
    0
  );
  return (
    <div className="zonal-heatmap mb-4">
      <div className="heatmap-header">
        <div className="heatmap-icon">
          <FiMapPin />
        </div>

        <div>
          <h3>Zonal Recruitment Heatmap</h3>
          <p>Recruitment activity by zone</p>
        </div>
      </div>

      <div className="zone-carousel">
        {showLeftArrow && (
          <button className="zone-nav-btn left" onClick={handlePrev}>
            <FiChevronLeft />
          </button>
        )}

        <div className="zone-grid">
          {visibleZones.map((zone) => (
            <div
              key={zone.city}
              className="zone-card"
              style={{ borderTopColor: zone.color }}
            >
              <div
                className="zone-icon"
                style={{
                  background: `${zone.color}12`,
                  color: zone.color,
                }}
              >
                <FiMapPin />
              </div>

              <h4>{zone.city}</h4>
              <span>{zone.state}</span>

              <div className="zone-stats">
                <div>
                  <span>Candidates</span>
                  <strong>{zone.candidates}</strong>
                </div>

                <div>
                  <span>Offered</span>
                  <strong>{zone.offered}</strong>
                </div>

                <div>
                  <span>Rejected</span>
                  <strong>{zone.rejected}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button className="zone-nav-btn right" onClick={handleNext}>
            <FiChevronRight />
          </button>
        )}
      </div>

      <div className="heatmap-summary">
        <div>
          <h2>{zonalHeatmap.length}</h2>
          <p>Total Zones</p>
        </div>

        <div>
          <h2 className="candidate">{totalCandidates}</h2>
          <p>Total Candidates</p>
        </div>

        <div>
          <h2 className="offered">{totalOffered}</h2>
          <p>Total Offered</p>
        </div>

        <div>
          <h2 className="rejected">{totalRejected}</h2>
          <p>Total Rejected</p>
        </div>
      </div>
    </div>
  );
};

export default ZonalRecruitmentHeatmap;
