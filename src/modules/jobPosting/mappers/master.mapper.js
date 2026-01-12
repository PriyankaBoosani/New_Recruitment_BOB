// src/modules/jobPosting/mappers/master.mapper.js
export const mapMasterResponse = (masterData, userData, certData) => {
  const certList = Array.isArray(certData)
      ? certData
      : Array.isArray(certData?.data)
        ? certData.data
        : [];
  return {
    departments: (masterData.departments || []).map(d => ({
      id: String(d.departmentId),
      label: d.departmentName,
    })),

    positions: (masterData.masterPositions || []).map(p => ({
      id: String(p.masterPositionsId),
      name: p.positionName,
      deptId: String(p.deptId),
      minAge: p.eligibilityAgeMin,
      maxAge: p.eligibilityAgeMax,
      gradeId: String(p.gradeId),
      mandatoryEducation: p.mandatoryEducation,
      preferredEducation: p.preferredEducation,
      mandatoryExperience: p.mandatoryExperience,
      preferredExperience: p.preferredExperience,
      rolesResponsibilities: p.rolesResponsibilities,
    })),

    jobGrades: (masterData.jobGrade || []).map(g => ({
      id: String(g.jobGradeId),
      code: g.jobGradeCode,
      scale: g.jobScale,
    })),

    employmentTypes: (masterData.employementTypes || []).map(e => ({
      id: String(e.employementTypeId),
      label: e.typeName,
    })),

    reservationCategories: (masterData.reservationCategories || []).map(c => ({
      id: String(c.reservationCategoriesId),
      code: c.categoryCode,
      label: c.categoryName,
    })),

    disabilityCategories: (masterData.disabilityCategories || []).map(c => ({
      id: String(c.disabilityCategoryId),
      disabilityCode: c.disabilityCode,
      disabilityName: c.disabilityName,
    })),

    /** 🔥 EDUCATION MASTER (NEW) */
    educationTypes: (masterData.educationTypeMaster || []).map(e => ({
      id: e.educationTypeId,
      label: e.educationType,
    })),

    qualifications: (masterData.mandatoryQualification || []).map(q => ({
      id: q.educationQualificationsId,
      code: q.qualificationCode,
      name: q.qualificationName,
      levelId: q.levelId,
    })),

    specializations: (masterData.specializationMaster || []).map(s => ({
      id: s.specializationId,
      label: s.specializationName,
    })),

    users: (userData || []).map(u => ({
      id: String(u.userId ?? u.id),
      name: u.userName ?? u.fullName ?? u.name,
      role: u.roleName ?? "",
    })),

    certifications: certList.map(c => ({
      id: c.certificationMasterId,
      name: c.certificationName,
      description: c.certificationDesc,
    })),

    state:(masterData.states || []).map(s => ({
      id: String(s.stateId),
      name: s.stateName,
    })),





  };
};
