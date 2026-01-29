import React from "react";

const LocationWiseVacancyTable = ({
  positionStateDistributions = [],
  states = []
}) => {
  if (!positionStateDistributions.length) return null;

  const stateMap = states.reduce((acc, s) => {
    acc[s.stateId] = s.stateName;
    return acc;
  }, {});

  return (
    <div className="info-card mt-3">
      <div className="fw-semibold mb-3">
        Category Wise Reservation (State-wise)
      </div>

      <div className="table-responsive">
        <table className="table table-bordered small text-center">
          <thead>
            <tr>
              <th rowSpan="2">State Name</th>
              <th colSpan="6">Category</th>
              <th colSpan="4">Disability</th>
            </tr>
            <tr>
              <th>GEN</th>
              <th>EWS</th>
              <th>SC</th>
              <th>ST</th>
              <th>OBC</th>
              <th>Total</th>
              <th>HI</th>
              <th>VI</th>
              <th>OC</th>
              <th>ID</th>
            </tr>
          </thead>

          <tbody>
            {positionStateDistributions.map((state, idx) => (
              <tr key={idx}>
                <td>{stateMap[state.stateId] || "Unknown"}</td>

                <td>{state.categories.GEN}</td>
                <td>{state.categories.EWS}</td>
                <td>{state.categories.SC}</td>
                <td>{state.categories.ST}</td>
                <td>{state.categories.OBC}</td>
                <td>{state.totalVacancies}</td>

                <td>{state.disabilities.HI}</td>
                <td>{state.disabilities.VI}</td>
                <td>{state.disabilities.OC}</td>
                <td>{state.disabilities.ID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationWiseVacancyTable;
