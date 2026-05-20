export const mapEducationListFromApi = (list = [], educationOptions = []) => {
  const docMap = new Map(
    educationOptions.map(opt => [
      String(opt.documentTypeId).toLowerCase(),
      opt.documentName
    ])
  );
  return list.map(item => {
    const docId = String(item?.qualification?.levelId || "").toLowerCase();

    const documentName = docMap.get(docId);

    return {
      educationLevel: documentName || "-", // 🔥 final output
      qualificationCode: item?.qualification?.qualificationCode  || "-", // 🔥 final output
      course: item?.qualification?.qualificationName || "-",
      specialization: Array.isArray(item?.specializations)
        ? item.specializations.map(s => ({
          name: s.specializationName,
          id: s.specializationId,
          code: s.specializationCode
        }))
        : [],
      educationQualificationsId: item?.qualification?.educationQualificationsId || "-",
    };
  });
};

