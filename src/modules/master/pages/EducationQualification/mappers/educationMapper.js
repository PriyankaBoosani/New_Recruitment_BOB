export const mapEducationListFromApi = (list = [], educationOptions = []) => {
  const docMap = new Map(
    educationOptions.map((opt) => [
      String(opt.documentTypeId).toLowerCase(),
      opt.documentName,
    ])
  );

  return list.map((item) => {
    const docId = String(item?.qualification?.levelId || "").toLowerCase();

    const firstGroup = item?.specializations?.[0]?.group || null;
console.log(
  "API isIntegratedCourse:",
  item?.qualification?.isIntegratedCourse
);
    return {
      educationLevel: docMap.get(docId) || "-",
      qualificationCode: item?.qualification?.qualificationCode || "-",
      course: item?.qualification?.qualificationName || "-",

      //  ADD THIS
      group: firstGroup,
      icGroups: item?.qualification?.icGroups || [],
      isIntegratedCourse: item?.qualification?.isIntegratedCourse === true,
      specialization:
        item?.specializations?.map((sp) => ({
          id: sp?.specialization?.specializationId || "",
          name: sp?.specialization?.specializationName || "",
          code: sp?.specialization?.specializationCode || "",
          icGroups: sp?.specialization?.icGroups || [],

          group: sp?.group?.educationGroupId || "",
          groupName: sp?.group?.groupName || "",
          groupCode: sp?.group?.groupCode || "",
          readOnly: true,
        })) || [],

      educationQualificationsId:
        item?.qualification?.educationQualificationsId || "",
    };
   
  });
  
};
