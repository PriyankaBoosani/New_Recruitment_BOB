import React from "react";
 
const NationalVacancyTable = ({
  positionCategoryNationalDistributions = []
}) => {
  if (!positionCategoryNationalDistributions.length) return null;
 
  const categoryMap = {};
  positionCategoryNationalDistributions.forEach(item => {
    categoryMap[item.category_code] = item.vacancies;
  });
 
  // Split categories automatically
  const generalCategories = ["GEN", "EWS", "SC", "ST", "OBC"];
  const disabilityCategories = ["HI", "VI", "OC", "ID"];
 
  const total = generalCategories.reduce(
    (sum, c) => sum + (categoryMap[c] || 0),
    0
  );
 
  return (
<div className="info-card mt-3">
<div className="category-title mb-2">
        Category Wise Reservation :
</div>
 
      <div className="table-responsive">
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
              {generalCategories.map(code => (
<th key={code}>{code}</th>
              ))}
<th>Total</th>
              {disabilityCategories.map(code => (
<th key={code}>{code}</th>
              ))}
</tr>
</thead>
 
          <tbody>
<tr>
              {generalCategories.map(code => (
<td key={code}>{categoryMap[code] || 0}</td>
              ))}
<td>{total}</td>
              {disabilityCategories.map(code => (
<td key={code}>{categoryMap[code] || 0}</td>
              ))}
</tr>
</tbody>
</table>
</div>
</div>
  );
};
 
export default NationalVacancyTable;