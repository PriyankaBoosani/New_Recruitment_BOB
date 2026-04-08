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
      course: item?.qualification?.qualificationName || "-",
      specialization: Array.isArray(item?.specializations)
        ? item.specializations.map(s => s.specializationName)
        : [],
      educationQualificationsId: item?.qualification?.educationQualificationsId || "-",
    };
  });
};

// export const mapEducationListFromApi = (list = []) => {
//   return list.map(item => ({
//     educationLevel: item?.qualification?.documentName || "-",
//     course: item?.qualification?.qualificationName || "-",
//     specialization: item?.specializations?.map(
//       s => s.specializationName
//     ) || [],
//   }));
// };