import React from "react";
 
const NationalVacancyTable = ({ positionStateDistributions = [] }) => {
  if (!positionStateDistributions.length) return null;
 
  const generalCategories = ["GEN", "EWS", "SC", "ST", "OBC"];
  const disabilityCategories = ["HI", "VI", "OC", "ID"];
 
  const mapCategory = { 1: "GEN", 2: "EWS", 3: "SC", 4: "ST", 5: "OBC" };
  const mapDisability = { 1: "HI", 2: "VI", 3: "OC", 4: "ID" };
 
  const totals = {};
  [...generalCategories, ...disabilityCategories].forEach(
    k => (totals[k] = 0)
  );
 
  positionStateDistributions.forEach(state => {
    Object.entries(state.categories || {}).forEach(([id, val]) => {
      totals[mapCategory[id]] += val || 0;
    });
 
    Object.entries(state.disability || {}).forEach(([id, val]) => {
      totals[mapDisability[id]] += val || 0;
    });
  });
 
  const totalVacancies = generalCategories.reduce(
    (s, c) => s + totals[c],
    0
  );
 
  return (
    <div className="info-card mt-3">
      <div className="category-title mb-2 fw-semibold">
        Category Wise Reservation :
      </div>
 
      <table className="table table-bordered small text-center mb-0">
        <thead>
          <tr>
            <th colSpan={generalCategories.length + 1}>
              General Category
            </th>
            <th colSpan={disabilityCategories.length}>
              Disability Category
            </th>
          </tr>
          <tr>
            {generalCategories.map(c => <th key={c}>{c}</th>)}
            <th>Total</th>
            {disabilityCategories.map(c => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            {generalCategories.map(c => (
              <td key={c}>{totals[c]}</td>
            ))}
            <td>{totalVacancies}</td>
            {disabilityCategories.map(c => (
              <td key={c}>{totals[c]}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
 
export default NationalVacancyTable;