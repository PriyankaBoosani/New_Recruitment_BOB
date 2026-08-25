import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  validateEducationForm,
  validateEducationLevel,
  validateCourse,
  validateSpecialization,
} from "../../../../../shared/utils/educationValidations";
import { useTranslation } from "react-i18next";

import masterApiService from "../../../services/masterApiService";
import { mapEducationListFromApi } from "../mappers/educationMapper";

export const useExperience = () => {
  const { t } = useTranslation(["education", "common"]);

  const [experienceList, setExperienceList] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qualificationOptions, setQualificationOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupOptions, setGroupOptions] = useState([]);
  const [integratedSpecializationOptions, setIntegratedSpecializationOptions] =
    useState([]);

  const [formData, setFormData] = useState([
    {
      educationLevel: "",
      course: "",
      group: "",
      educationQualificationsId: "",
      specializationOthers: [],
      integratedGroup: [],
      integratedSpecializations: [],
      isIntegratedCourse: false, // ADD
    },
  ]);

  const [errors, setErrors] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const fetchEducationOptions = async () => {
    try {
      setLoading(true);

      const res = await masterApiService.getAllDocumentTypes();

      const list = res.data || [];
      const filtered = list.filter(
        (item) => item?.docType?.toLowerCase() === "educationdocs"
      );
      setEducationOptions(filtered);

      const ids = filtered.map((item) => item.documentTypeId);

      return { ids, filtered };
    } catch (err) {
      toast.error("Failed to fetch education dropdown");
      return { ids: [], filtered: [] };
    } finally {
      setLoading(false);
    }
  };

  const fetchEducationGroups = async () => {
    try {
      const res = await masterApiService.getEducationGroups();

      setGroupOptions(
        (res.data || []).map((item) => ({
          value: item.educationGroupId,
          label: item.groupName,
        }))
      );
    } catch (err) {
      toast.error("Failed to fetch education groups");
    }
  };

  const fetchEducationByIds = async (ids, educationOptionsList) => {
    try {
      setLoading(true);

      const res = await masterApiService.getAllEducation(ids);

      const list = res.data || [];
      setQualificationOptions(list);
      const mapped = mapEducationListFromApi(list, educationOptionsList);

      setExperienceList(mapped);
    } catch (err) {
      toast.error("Failed to fetch education data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchEducationGroups();
    const { ids, filtered } = await fetchEducationOptions();

    if (ids?.length) {
      await fetchEducationByIds(ids, filtered);
    }
  };

  const handleFieldChange = (formIndex, field, value, specIndex = null) => {
    const courseRegex = /^[A-Za-z0-9\s.&,()+\-_/]*$/;
    const specializationRegex = /^[A-Za-z0-9\s.&,()+\-_/]*$/;
    if (field === "course") {
      if (!courseRegex.test(value)) return;
    }

    if (field === "specialization") {
      if (!specializationRegex.test(value)) return;
    }

    const updated = [...formData];
    if (field === "isIntegratedCourse") {
      updated[formIndex].isIntegratedCourse = value;

      if (value === true) {
        // Only clear specialization IDs
        updated[formIndex].specializationOthers =
          updated[formIndex].specializationOthers?.map((spec) => ({
            ...spec,
            id: null,
          })) || [];
      }
    } else if (field === "integratedSpecializations") {
      // Integrated Specialization belongs to a specific specialization row
      if (
        specIndex !== null &&
        updated[formIndex].specializationOthers?.[specIndex]
      ) {
        updated[formIndex].specializationOthers[
          specIndex
        ].integratedSpecializations = value || [];
      }
    } else if (field === "specialization") {
      updated[formIndex].specializationOthers[specIndex].name = value;
    } else if (field === "specializationCode") {
      updated[formIndex].specializationOthers[specIndex].code = value;
    } else if (field === "specializationGroup") {
      updated[formIndex].specializationOthers[specIndex].group = value;
    } else {
      updated[formIndex][field] = value;
    }

    setFormData(updated);

    let fieldError = null;

    if (field === "educationLevel") {
      fieldError = validateEducationLevel(value);
    }

    if (field === "course") {
      fieldError = null;
    }

    if (field === "courseCode") {
      fieldError = value?.trim()
        ? null
        : t("education:course_code_required", "Course code is required");
    }

    if (field === "group") {
      fieldError = value?.trim()
        ? null
        : t("education:group_required", "Group is required");
    }

    if (field === "specialization") {
      fieldError = validateSpecialization(
        updated[formIndex].specializationOthers
      );
    }

    const updatedErrors = [...errors];

    if (!updatedErrors[formIndex]) {
      updatedErrors[formIndex] = {};
    }

    if (field === "specialization") {
      updatedErrors[formIndex].specialization = fieldError;
    } else {
      updatedErrors[formIndex][field] = fieldError;
    }

    setErrors(updatedErrors);
  };

  const handleAddSpec = (formIndex) => {
    if (formData[formIndex]?.isIntegratedCourse === true) {
      return;
    }
    const updated = [...formData];
    updated[formIndex].specializationOthers.push({
      name: "",
      code: "",
      id: null,
      integratedSpecializations: [],
    });
    setFormData(updated);
  };

  const handleRemoveSpec = (formIndex, i) => {
    const updated = [...formData];
    updated[formIndex].specializationOthers = updated[
      formIndex
    ].specializationOthers.filter((_, idx) => idx !== i);
    setFormData(updated);
  };

  const handleAddClick = () => {
    setFormData([
      {
        educationLevel: "",
        course: "",
        courseCode: "",
        group: "",
        integratedGroup: [],
        integratedSpecializations: [],
        specializationOthers: [],
        isIntegratedCourse: false,
        // specializationOthers: [{ name: "", id: "" }]
      },
    ]);
    setErrors([]);
    setIsEditMode(false);
    setEditIndex(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditIndex(null);
    setErrors([]);

    setFormData([
      {
        educationLevel: "",
        course: "",
        courseCode: "",
        group: "",
        educationQualificationsId: "",
        specializationOthers: [],
        isIntegratedCourse: false,
        integratedGroup: [],
        integratedSpecializations: [],
      },
    ]);
  };

  const saveExperience = async () => {
    try {
      const selectedEducation = educationOptions.find(
        (item) => item.documentTypeId === formData[0].educationLevel
      );

      const { valid, errors: newErrors } = validateEducationForm(formData[0], {
        existing: experienceList,
        currentId: formData[0].educationQualificationsId,
        editMode: isEditMode,
        educationLevelName: selectedEducation?.documentName || "",
      });

      const readOnlyCodes =
        isEditMode &&
        [
          "Graduation",
          "Post-Graduation",
          "Any Graduation",
          "Any Post-Graduation",
        ].includes(formData[0].course?.trim());

      const hideGroup =
        ["Any Graduation", "Any Post-Graduation"].includes(
          formData[0].course?.trim()
        ) ||
        ["10th / SSC", "Intermediate / 12th / HSC"].includes(
          selectedEducation?.documentName
        );

      const showTopGroup =
        !hideGroup && (formData[0].specializationOthers?.length || 0) === 0;

      if (
        showTopGroup &&
        !formData[0].isIntegratedCourse &&
        !formData[0].group?.trim()
      ) {
        newErrors.group = t("education:group_required", "Group is required");
      }
      if (
        formData[0].isIntegratedCourse === true &&
        (!Array.isArray(formData[0].integratedGroup) ||
          formData[0].integratedGroup.length === 0)
      ) {
        newErrors.integratedGroup = t(
          "education:integrated_group_required",
          "Integrated Group is required"
        );
      }
      const specs = formData[0].specializationOthers || [];

      let hasSpecializationError = false;

      // Only validate normal specializations for NON-integrated courses
      if (!formData[0].isIntegratedCourse) {
        if (!Array.isArray(newErrors.specialization)) {
          newErrors.specialization = newErrors.specialization
            ? [{ name: newErrors.specialization }]
            : [];
        }

        specs.forEach((s, index) => {
          if (!s.name?.trim()) {
            newErrors.specialization[index] = {
              name: t(
                "education:specialization_required",
                "Specialization Name is required"
              ),
            };
          }
        });

        hasSpecializationError = newErrors.specialization.some((e) => e?.name);
      } else {
        // Integrated course does not require normal specialization
        newErrors.specialization = [];
      }
      const hasIntegratedGroupError = !!newErrors.integratedGroup;

      if (
        !valid ||
        newErrors.group ||
        hasSpecializationError ||
        hasIntegratedGroupError
      ) {
        console.log("SAVE STOPPED - VALIDATION ERRORS:", newErrors);

        setErrors([newErrors]);
        return;
      }
      const selectedIntegratedSpecializationIds =
        formData[0].isIntegratedCourse === true
          ? formData[0].integratedSpecializations || []
          : [];

      console.log("8. SELECTED INTEGRATED SPECIALIZATION IDS:", {
        ids: selectedIntegratedSpecializationIds,
        isIntegratedCourse: formData[0].isIntegratedCourse,
      });

      const selectedIntegratedSpecializations = (
        integratedSpecializationOptions || []
      ).filter((sp) =>
        selectedIntegratedSpecializationIds.includes(sp.specializationId)
      );

      console.log(
        "9. SELECTED INTEGRATED SPECIALIZATIONS:",
        selectedIntegratedSpecializations
      );

      const integratedSpecializations = selectedIntegratedSpecializations.map(
        (sp) => ({
          specialization: {
            specializationId: sp.specializationId,
            educationQualificationsId:
              sp.educationQualificationsId ||
              formData[0].educationQualificationsId ||
              null,
            specializationName: sp.specializationName,
            specializationCode: sp.specializationCode || null,
            icGroups: sp.integratedSpecializations || [],
          },

          group: {
            educationGroupId: null,
            groupCode: null,
            groupName: null,
            displayOrder: 0,
          },
        })
      );

      console.log(
        "10. INTEGRATED SPECIALIZATIONS PAYLOAD:",
        integratedSpecializations
      );

      const specializations =
        specs.length > 0
          ? specs.map((s) => ({
              specialization: {
                specializationId: s.id || null,
                educationQualificationsId:
                  formData[0].educationQualificationsId || null,
                specializationName: s.name || null,
                icGroups: s.integratedSpecializations || [],
                ...(readOnlyCodes && s.id
                  ? {}
                  : {
                      specializationCode: s.code || null,
                    }),
              },
              group: {
                educationGroupId: s.group || formData[0].group || null,
                groupCode: null,
                groupName: null,
                displayOrder: 0,
              },
            }))
          : formData[0].group
            ? [
                {
                  specialization: {
                    specializationId: null,
                    educationQualificationsId:
                      formData[0].educationQualificationsId || null,
                    specializationName: null,
                    specializationCode: null,
                  },
                  group: {
                    educationGroupId: formData[0].group,
                    groupCode: null,
                    groupName: null,
                    displayOrder: 0,
                  },
                },
              ]
            : [];

      console.log("11. NORMAL SPECIALIZATIONS:", specializations);

      const payload = {
        qualification: {
          levelId: formData[0].educationLevel,
          qualificationName: formData[0].course,
          ...(readOnlyCodes
            ? {}
            : {
                qualificationCode: formData[0].courseCode || "",
              }),
          displayOrder: 0,
          educationQualificationsId:
            formData[0].educationQualificationsId || null,

          isIntegratedCourse: formData[0].isIntegratedCourse === true,

          icGroups: formData[0].integratedGroup || [],
        },

        specializations: [...specializations, ...integratedSpecializations],
      };

      console.log("12. FINAL PAYLOAD:", payload);

      console.log("13. PAYLOAD INTEGRATED VALUE:", {
        isIntegratedCourse: payload.qualification.isIntegratedCourse,
        type: typeof payload.qualification.isIntegratedCourse,
        icGroups: payload.qualification.icGroups,
        icGroupsLength: payload.qualification.icGroups?.length,
      });

      console.log("14. CALLING saveEducation API...");

      const res = await masterApiService.saveEducation(payload);

      console.log("15. API SAVE RESPONSE:", res);

      if (res.success) {
        console.log("16. SAVE SUCCESS - NOW RELOADING DATA");
        await loadData();
      } else {
        console.log("16. SAVE FAILED:", {
          message: res.message,
          data: res.data,
        });
      }

      if (isEditMode) {
        if (res.success) {
          toast.success(t("education:updated_success"));
        } else {
          toast.error(res.message + ": " + res.data);
        }
      } else {
        if (res.success) {
          toast.success(t("education:saved_success"));
        } else {
          toast.error(res.message + ": " + res.data);
        }
      }

      if (res.success) {
        setShowModal(false);
        setIsEditMode(false);
        setEditIndex(null);
      }

      console.log("========== SAVE END ==========");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      toast.error("Save failed");
    }
  };
  const fetchIntegratedSpecializations = async (qualificationIds) => {
    try {
      if (!qualificationIds?.length) {
        setIntegratedSpecializationOptions([]);
        return;
      }

      const res = await masterApiService.getSpecializations(qualificationIds);

      setIntegratedSpecializationOptions(res.data || []);
    } catch (error) {
      console.error("Failed to fetch integrated specializations:", error);

      setIntegratedSpecializationOptions([]);
    }
  };
  const handleDelete = (index) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== index));
    toast.success(t("education:deleted_success"));
  };

  const handleEditClick = (item, index) => {
    console.log("========== EDIT START ==========");

    console.log("1. ORIGINAL ITEM:", item);

    console.log("2. ORIGINAL isIntegratedCourse:", {
      value: item?.isIntegratedCourse,
      type: typeof item?.isIntegratedCourse,
    });

    console.log("3. ORIGINAL icGroups:", {
      value: item?.icGroups,
      isArray: Array.isArray(item?.icGroups),
      length: item?.icGroups?.length,
    });

    const selectedOption = educationOptions.find(
      (opt) =>
        String(opt.documentName).toLowerCase() ===
        String(item.educationLevel).toLowerCase()
    );

    console.log("4. SELECTED EDUCATION:", selectedOption);

    const integratedGroup = Array.isArray(item.icGroups)
      ? item.icGroups.map((group, index) => ({
          key: group?.key ?? index,
          value: String(group?.value || ""),
        }))
      : [];

    console.log("5. MAPPED integratedGroup:", integratedGroup);

    const isIntegratedCourse = item.isIntegratedCourse === true;

    console.log("6. CALCULATED isIntegratedCourse:", {
      value: isIntegratedCourse,
      type: typeof isIntegratedCourse,
      originalValue: item?.isIntegratedCourse,
      comparisonResult: item?.isIntegratedCourse === true,
    });

    const specializationOthers = isIntegratedCourse
      ? []
      : (item.specialization || [])
          .filter((spec) => spec?.id || spec?.name?.trim())
          .map((spec, index) => {
            const integratedSpecializations = Array.isArray(spec.icGroups)
              ? spec.icGroups.map((g) =>
                  typeof g === "object" ? String(g.value) : String(g)
                )
              : [];

            console.log(`7.${index} SPECIALIZATION:`, {
              spec,
              originalIcGroups: spec?.icGroups,
              mappedIntegratedSpecializations: integratedSpecializations,
            });

            return {
              ...spec,
              integratedSpecializations,
            };
          });

    const editFormData = {
      educationLevel: selectedOption?.documentTypeId || "",
      course: item.course || "",
      courseCode: item.qualificationCode || "",
      educationQualificationsId: item.educationQualificationsId || "",

      group: item.group?.educationGroupId || "",

      specializationOthers,

      integratedGroup,

      isIntegratedCourse,

      integratedSpecializations: [],
    };

    console.log("8. FINAL FORM DATA BEFORE setFormData:", editFormData);

    console.log("9. FINAL isIntegratedCourse:", {
      value: editFormData.isIntegratedCourse,
      type: typeof editFormData.isIntegratedCourse,
    });

    setFormData([editFormData]);

    console.log("10. setFormData CALLED");

    if (integratedGroup.length > 0) {
      console.log(
        "11. FETCHING integrated specializations FOR:",
        integratedGroup.map((group) => group.value)
      );

      fetchIntegratedSpecializations(
        integratedGroup.map((group) => group.value)
      );
    } else {
      console.log("11. NO integratedGroup - skipping fetch");
    }

    setErrors([]);
    setIsEditMode(true);
    setEditIndex(index);
    setShowModal(true);

    console.log("========== EDIT END ==========");
  };

  // ✅ STEP 3: ADD THIS FILTER
  const filteredList = experienceList.filter((item) => {
    const search = searchTerm.toLowerCase();

    const educationMatch = item.educationLevel?.toLowerCase().includes(search);

    const courseMatch = item.course?.toLowerCase().includes(search);

    const specializationMatch = item.specialization?.some((s) =>
      s.name?.toLowerCase().includes(search)
    );

    return educationMatch || courseMatch || specializationMatch;
  });

  return {
    experienceList: filteredList,
    educationOptions,
    loading,
    showModal,
    searchTerm,
    formData,
    errors,
    currentPage,
    pageSize,
    isEditMode,
    groupOptions,

    setSearchTerm,
    setCurrentPage,
    setPageSize,

    handleAddClick,
    handleCloseModal,
    saveExperience,
    handleDelete,
    handleEditClick,

    handleFieldChange,
    handleAddSpec,
    handleRemoveSpec,
    qualificationOptions, // ADD THIS
    integratedSpecializationOptions,
    fetchIntegratedSpecializations,
  };
};
