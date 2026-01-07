// Global input change handler with context-based validation
export const handleGlobalInputChange = ({
  e,
  setFormData,
  errors,
  setErrors,
  t,
  context
}) => {
  const { name, value } = e.target;
 
  /* ================= DOCUMENT NAME ================= */
  if (name === "name" && context === "document") {
    if (!/^[A-Za-z0-9 _\-\/@]*$/.test(value)) {
      setErrors(prev => ({
        ...prev,
        name: t("validation:invalid_code_chars")
      }));
      return;
    }
 
    setErrors(prev => ({ ...prev, name: null }));
 
    setFormData(prev => ({
      ...prev,
      name: value.replace(/^\s+/, "") // ✅ only trim start
    }));
    return;
  }
 
  /* ================= POSITION TITLE ================= */
  if (name === "title" && context === "position") {
    if (!/^[A-Za-z0-9 _\-\/@]*$/.test(value)) {
      setErrors(prev => ({
        ...prev,
        title: t("validation:invalid_title_chars")
      }));
      return;
    }
 
    setErrors(prev => ({ ...prev, title: null }));
 
    setFormData(prev => ({
      ...prev,
      title: value.replace(/^\s+/, "") // ✅ allow multiple spaces
    }));
    return;
  }
 
  /* ================= CATEGORY / SPECIAL CATEGORY NAME ================= */
  if (name === "name") {
    if (!/^[A-Za-z\s]*$/.test(value)) {
      setErrors(prev => ({
        ...prev,
        name: t("validation:only_characters")
      }));
      return;
    }
 
    setErrors(prev => ({ ...prev, name: null }));
 
    setFormData(prev => ({
      ...prev,
      name: value.replace(/^\s+/, "")
    }));
    return;
  }
 
  /* ================= CODE ================= */
  if (name === "code") {
    if (!/^[A-Za-z0-9 _\-\/@]*$/.test(value)) {
      setErrors(prev => ({
        ...prev,
        code: t("validation:invalid_code_chars")
      }));
      return;
    }
 
    setErrors(prev => ({ ...prev, code: null }));
 
    setFormData(prev => ({
      ...prev,
      code: value.replace(/^\s+/, "")
    }));
    return;
  }
 
  /* ================= DEFAULT ================= */
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
 
  if (errors?.[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: null
    }));
  }
};



// Alphabets + space only (Department Name, Full Name)
export const handleAlphaSpaceInput = ({
  e,
  fieldName,
  setFormData,
  setErrors,
  errorMessage
}) => {
  let value = e.target.value;

  if (!/^[A-Za-z\s]*$/.test(value)) {
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    return;
  }

  // prevent leading spaces only
  value = value.replace(/^\s+/, "");

  setFormData(prev => ({
    ...prev,
    [fieldName]: value
  }));

  setErrors(prev => {
    const copy = { ...prev };
    delete copy[fieldName];
    return copy;
  });
};


// Textarea: alphabets, numbers, space, common punctuation
export const handleTextAreaInput = ({
  e,
  fieldName,
  setFormData,
  setErrors,
  errorMessage
}) => {
  let value = e.target.value;

  if (!/^[A-Za-z0-9\s.,\-()/]*$/.test(value)) {
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    return;
  }

  value = value.replace(/^\s+/, "");

  setFormData(prev => ({
    ...prev,
    [fieldName]: value
  }));

  setErrors(prev => {
    const copy = { ...prev };
    delete copy[fieldName];
    return copy;
  });
};


// ✅ Alphabets + Numbers + Space (Location Name, Search, etc.)
export const handleAlphaNumericSpaceInput = ({
  e,
  fieldName,
  setFormData,
  setErrors,
  errorMessage
}) => {
  let value = e.target.value;

  // ❌ allow only alphabets, numbers and space
  if (!/^[A-Za-z0-9\s]*$/.test(value)) {
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    return;
  }

  // ❌ prevent leading spaces
  value = value.replace(/^\s+/, "");

  // ❌ OPTIONAL: allow multiple spaces INSIDE (do NOT collapse)
  // ❗ remove this line if you want exact spacing as typed
  // value = value.replace(/\s{2,}/g, " ");

  // ✅ update form data
  setFormData(prev => ({
    ...prev,
    [fieldName]: value
  }));

  // ✅ clear error
  setErrors(prev => {
    const copy = { ...prev };
    delete copy[fieldName];
    return copy;
  });
};

// Numbers ONLY (Salary, Age, etc.)
export const handleNumberOnlyInput = ({
  e,
  fieldName,
  setFormData,
  setErrors,
  errorMessage
}) => {
  const value = e.target.value;

  // ❌ allow digits only
  if (!/^[0-9]*$/.test(value)) {
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    return;
  }

  setFormData(prev => ({
    ...prev,
    [fieldName]: value
  }));

  // ✅ clear field error
  setErrors(prev => {
    const copy = { ...prev };
    delete copy[fieldName];
    return copy;
  });
};



  












