import React from "react";
 
const LocationWiseVacancyTable = ({
  positionStateDistributions = [],
  states = [],
  reservationCategories = [],
  disabilities = []
}) => {
  if (!positionStateDistributions.length) return null;
 
  return (
<div className="border rounded p-3 mt-3">
<div className="fw-semibold mb-2">
        Category Wise Reservation (State-wise)
</div>
 
      <div className="table-responsive">
<table className="table table-bordered small">
<thead>
<tr>
<th rowSpan="2">State</th>
<th colSpan={reservationCategories.length + 1}>Category</th>
<th colSpan={disabilities.length}>Disability</th>
</tr>
<tr>
              {reservationCategories.map(c => (
<th key={c.category_id}>{c.category_code}</th>
              ))}
<th>Total</th>
 
              {disabilities.map(d => (
<th key={d.disability_id}>{d.disability_code}</th>
              ))}
</tr>
</thead>
 
          <tbody>
            {positionStateDistributions.map((row, i) => {
              const categoryTotal = reservationCategories.reduce(
                (s, c) => s + (row.categories?.[c.category_id] || 0),
                0
              );
 
              return (
<tr key={i}>
<td>{row.state_name}</td>
 
                  {reservationCategories.map(c => (
<td key={c.category_id}>
                      {row.categories?.[c.category_id] || 0}
</td>
                  ))}
 
                  <td>{categoryTotal}</td>
 
                  {disabilities.map(d => (
<td key={d.disability_id}>
                      {row.disability?.[d.disability_id] || 0}
</td>
                  ))}
</tr>
              );
            })}
</tbody>
</table>
</div>
</div>
  );
};
 
export default LocationWiseVacancyTable;