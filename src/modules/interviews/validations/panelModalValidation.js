export const validatePanelModal = ({ rows }) => {
  const errors = { rows: [] };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  rows.forEach((row, i) => {
    const rowErrors = {};

    if (!row.date) {
      rowErrors.date = "validation:required";
    } else if (new Date(row.date) < today) {
      rowErrors.date = "validation:past_dates_not_allowed";
    }

    if (!row.perDay) {
      rowErrors.perDay = "validation:required";
    } else if (!/^\d+$/.test(row.perDay)) {
      rowErrors.perDay = "validation:only_numbers";
    } else if (Number(row.perDay) <= 0) {
      rowErrors.perDay = "validation:greater_than_zero";
    }

    if (Object.keys(rowErrors).length) {
      errors.rows[i] = rowErrors;
    }
  });

  return errors.rows.length ? errors : {};
};
