export const validateAddPosition = ({
  formData,
  educationData,
  indentFile,
  approvedBy,
  approvedOn
}) => {
  const errors = {};


  // Upload / Approval
  if (!indentFile) errors.indentFile = "Indent file is required";
  if (!approvedBy) errors.approvedBy = "This field is required";
  if (!approvedOn) errors.approvedOn = "This field is required";

  // BASIC FIELDS
  if (!formData.position) errors.position = "This field is required";
  if (!formData.department) errors.department = "This field is required";
  if (!formData.vacancies) errors.vacancies = "This field is required";

  // AGE LOGIC (don’t mess this up)
  if (!formData.minAge) errors.minAge = "This field is required";
  if (!formData.maxAge) errors.maxAge = "This field is required";
  if (
    formData.minAge &&
    formData.maxAge &&
    Number(formData.minAge) >= Number(formData.maxAge)
  ) {
    errors.maxAge = "Max age must be greater than Min age";
  }

  // Employment / Grade
  if (!formData.employmentType) errors.employmentType = "This field is required";
  if (!formData.grade) errors.grade = "This field is required";

  // EDUCATION (correct fields)
  if (!educationData.mandatory.text)
    errors.mandatoryEducation = "This field is required";

  if (!educationData.preferred.text)
    errors.preferredEducation = "This field is required";

  // EXPERIENCE
  const mandatoryYears = Number(formData.mandatoryExperience.years || 0);
  const mandatoryMonths = Number(formData.mandatoryExperience.months || 0);
  if (mandatoryYears === 0 && mandatoryMonths === 0) {
    errors.mandatoryExperience = "Please select experience duration";
  } else if (!formData.mandatoryExperience.description?.trim()) {
    errors.mandatoryExperience = "Please enter mandatory experience details";
  }

  // Preferred Experience
  const preferredYears = Number(formData.preferredExperience.years || 0);
  const preferredMonths = Number(formData.preferredExperience.months || 0);

  if (preferredYears === 0 && preferredMonths === 0) {
    errors.preferredExperience = "Please select experience duration";
  } else if (!formData.preferredExperience.description?.trim()) {
    errors.preferredExperience = "Please enter preferred experience details";
  }


  // ROLES
  if (!formData.responsibilities)
    errors.responsibilities = "This field is required";
  
  if(!formData.medicalRequired) 
    errors.medicalRequired = "This field is required";  

  return errors;

};
