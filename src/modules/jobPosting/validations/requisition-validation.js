// const allowedExtensions = /\.(pdf|doc|docx|png|jpe?g)$/i;

export const validateRequisitionForm = (
  formData = {},
  // indentFile,
  // isEditing = false,
  // existingIndentPath = null
) => {
  const errors = {};
  let valid = true;

  if (!formData.title?.trim()) {
    errors.title = "This field is required";
    valid = false;
  }

  if (!formData.description?.trim()) {
    errors.description = "This field is required";
    valid = false;
  }

  if (!formData.startDate) {
    errors.startDate = "This field is required";
    valid = false;
  }

  if (!formData.endDate) {
    errors.endDate = "This field is required";
    valid = false;
  }

  // ---------- INDENT VALIDATION ----------
  // if (!indentFile) {
  //   if (!isEditing || !existingIndentPath) {
  //     errors.indentFile = "Indent file is required";
  //     valid = false;
  //   }
  // } else {
  //   if (indentFile instanceof File) {
  //     if (!allowedExtensions.test(indentFile.name)) {
  //       errors.indentFile =
  //         "Invalid file type. Upload PDF, DOC, DOCX, PNG, or JPG";
  //       valid = false;
  //     }

  //     if (indentFile.size > 5 * 1024 * 1024) {
  //       errors.indentFile = "File size must be less than 5MB";
  //       valid = false;
  //     }
  //   }
  // }

  return { valid, errors };
};
