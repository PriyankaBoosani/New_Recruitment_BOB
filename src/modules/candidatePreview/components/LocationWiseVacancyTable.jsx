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
    <div className="mt-3 p-3" style={{ backgroundColor: '#f5f7fb', borderRadius: '10px' }}>
      <div className="category-title fs-14" style={{ fontWeight: 600 }}>
        Category Wise Reservation (State-wise)
      </div>

      <div className="table-responsive">
        <table className="table table-bordered small text-center mb-0">
          <thead>
            <tr>
              <th rowSpan="2" className="light_font fw-600 fs-13">State Name</th>
              <th colSpan="6" className="light_font fw-600 fs-13" style={{ padding: '10px 8px' }}>Category</th>
              <th colSpan="4" className="light_font fw-600 fs-13" style={{ padding: '10px 8px' }}>Disability</th>
            </tr>
            <tr>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>GEN</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>EWS</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>SC</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>ST</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>OBC</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>Total</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>HI</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>VI</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>OC</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>ID</th>
            </tr>
          </thead>

          <tbody>
            {positionStateDistributions.map((state, idx) => (
              <tr key={idx}>
                <td>{stateMap[state.stateId] || "Unknown"}</td>

                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.GEN}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.EWS}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.SC}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.ST}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.OBC}</td>
                <td className="fw-600" style={{ backgroundColor: '#f1f3f9', padding: '12px 6px' }}>{state.totalVacancies}</td>

                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.disabilities.HI}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.disabilities.VI}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.disabilities.OC}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.disabilities.ID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationWiseVacancyTable;
