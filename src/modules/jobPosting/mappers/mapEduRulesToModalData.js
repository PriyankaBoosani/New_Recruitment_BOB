// utils/mapEduRulesToModalData.js
export function mapEduRulesToModalData(eduRulesJson, educationTypes, qualifications, specializations, certifications) {
  if (!eduRulesJson) {
    return { groups: [], certGroups: [] };
  }

  // Helper to create groups from educations array
  const createGroupsFromEducations = (educations) => {
    if (!educations || educations.length === 0) {
      return [{ rows: [{
        educationTypeId: "",
        educationQualificationsId: "",
        specializationId: "",
        duration: "",
        gpa: "",
        percentage: ""
      }] }];
    }

    // Group educations by OR logic - each education becomes its own group
    // If there are multiple educations, they should be in separate groups (OR logic)
    return educations.map(edu => ({
      rows: [{
        educationTypeId: edu.educationTypeId || "",
        educationQualificationsId: edu.educationQualificationsId || "",
        specializationId: edu.specializationId || "",
        duration: edu.duration || "",
        gpa: edu.gpa || "",
        percentage: edu.percentage || ""
      }]
    }));
  };

  // Helper to create cert groups from certification IDs
  const createCertGroupsFromIds = (certIds) => {
    if (!certIds || certIds.length === 0) {
      return [{ certRows: [{ certificationId: "" }] }];
    }

    // Group certifications by OR logic - each certification becomes its own group
    return certIds.map(certId => ({
      certRows: [{ certificationId: certId }]
    }));
  };

  // Mandatory
  if (Array.isArray(eduRulesJson.mandatoryEducations)) {
    return {
      groups: createGroupsFromEducations(eduRulesJson.mandatoryEducations),
      certGroups: createCertGroupsFromIds(eduRulesJson.mandatoryCertificationIds || [])
    };
  }

  // Preferred
  if (Array.isArray(eduRulesJson.preferredEducations)) {
    return {
      groups: createGroupsFromEducations(eduRulesJson.preferredEducations),
      certGroups: createCertGroupsFromIds(eduRulesJson.preferredCertificationIds || [])
    };
  }

  return { groups: [], certGroups: [] };
}

