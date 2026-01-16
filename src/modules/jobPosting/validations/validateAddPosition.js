export const validateAddPosition = ({
  isEditMode,
  formData,
  educationData,
  indentFile,
  existingIndentPath,
  approvedBy,
  approvedOn,
  nationalCategories    
}) => {
  const errors = {};

  if (!indentFile && !(isEditMode && existingIndentPath)) {
    errors.indentFile = "Indent file is required";
  }

  if (!approvedBy) errors.approvedBy = "This field is required";
  if (!approvedOn) errors.approvedOn = "This field is required";

  if (!formData.position) errors.position = "This field is required";
  if (!formData.department) errors.department = "This field is required";

  if (formData.vacancies === "" || Number(formData.vacancies) <= 0) {
    errors.vacancies = "This field is required";
  }

  if (formData.minAge === "" || Number(formData.minAge) <= 0) {
    errors.minAge = "This field is required";
  }

  if (formData.maxAge === "" || Number(formData.maxAge) <= 0) {
    errors.maxAge = "This field is required";
  }

  if (
    formData.minAge !== "" &&
    formData.maxAge !== "" &&
    Number(formData.minAge) >= Number(formData.maxAge)
  ) {
    errors.maxAge = "Max age must be greater than Min age";
  }

  if (!formData.employmentType) errors.employmentType = "This field is required";
  if (!formData.grade) errors.grade = "This field is required";

  if (!educationData.mandatory.text?.trim()) {
    errors.mandatoryEducation = "This field is required";
  }

  if (!educationData.preferred.text?.trim()) {
    errors.preferredEducation = "This field is required";
  }

  const my = Number(formData.mandatoryExperience.years || 0);
  const mm = Number(formData.mandatoryExperience.months || 0);

  if (my === 0 && mm === 0) {
    errors.mandatoryExperience = "Please select experience duration";
  } else if (!formData.mandatoryExperience.description?.trim()) {
    errors.mandatoryExperience = "Please enter mandatory experience details";
  }

  const py = Number(formData.preferredExperience.years || 0);
  const pm = Number(formData.preferredExperience.months || 0);

  if (py === 0 && pm === 0) {
    errors.preferredExperience = "Please select experience duration";
  } else if (!formData.preferredExperience.description?.trim()) {
    errors.preferredExperience = "Please enter preferred experience details";
  }

  if (!formData.responsibilities?.trim()) {
    errors.responsibilities = "This field is required";
  }

  if (!formData.medicalRequired) {
    errors.medicalRequired = "This field is required";
  }
  // NATIONAL DISTRIBUTION VALIDATION
if (!formData.enableStateDistribution) {
  const nationalTotal = Object.values(nationalCategories || {})
    .reduce((sum, v) => sum + Number(v || 0), 0);

  const totalVacancies = Number(formData.vacancies || 0);
  

  if (nationalTotal !== totalVacancies) {
    errors.nationalDistribution =
      `National distribution total (${nationalTotal}) must equal total vacancies (${totalVacancies})`;
  }
}


  return errors;
};
