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
    const specializationRegex = /^[A-Za-z0-9\s.&,()\-_/]*$/;

    if (field === "course") {
      if (!courseRegex.test(value)) return;
    }

    if (field === "specialization") {
      if (!specializationRegex.test(value)) return;
    }

    const updated = [...formData];

    if (field === "integratedSpecializations") {
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

      if (showTopGroup && !formData[0].group?.trim()) {
        newErrors.group = t("education:group_required", "Group is required");
      }

      const specs = formData[0].specializationOthers || [];

      // Validate specialization rows BEFORE returning
      specs.forEach((s, index) => {
        // User added a specialization row but left Name empty
        if (!s.name?.trim()) {
          newErrors.specialization = newErrors.specialization || [];
          newErrors.specialization[index] = {
            name: t(
              "education:specialization_required",
              "Specialization Name is required"
            ),
          };
        }
      });

      const hasSpecializationError = newErrors.specialization?.some(
        (e) => e?.name
      );

      // Set all errors only once
      setErrors([newErrors]);

      // Return only after all validations are completed
      if (!valid || newErrors.group || hasSpecializationError) {
        return;
      }

      const selectedIntegratedSpecializationIds =
        formData[0].integratedSpecializations || [];

      const selectedIntegratedSpecializations = (
        integratedSpecializationOptions || []
      ).filter((sp) =>
        selectedIntegratedSpecializationIds.includes(sp.specializationId)
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

            // ONLY selected Integrated Group IDs
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

      const specializations =
        specs.length > 0
          ? specs.map((s) => ({
              specialization: {
                specializationId: s.id || null,
                educationQualificationsId:
                  formData[0].educationQualificationsId || null,
                specializationName: s.name || null,

                // Add this
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
          icGroups: formData[0].integratedGroup || [],
        },
        specializations: [...specializations, ...integratedSpecializations],
      };
      console.log("FINAL EDUCATION PAYLOAD:", payload);
      const res = await masterApiService.saveEducation(payload);
      console.log("savepayload", res);

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
        await loadData();
        setShowModal(false);
        setIsEditMode(false);
        setEditIndex(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };
  const fetchIntegratedSpecializations = async (qualificationIds) => {
    try {
      if (!qualificationIds?.length) {
        setIntegratedSpecializationOptions([]);
        return;
      }

      console.log(
        "Integrated Group IDs sent to specialization API:",
        qualificationIds
      );

      const res = await masterApiService.getSpecializations(qualificationIds);

      console.log("Integrated Specialization Response:", res.data);

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
    const selectedOption = educationOptions.find(
      (opt) =>
        opt.documentName.toLowerCase() ===
        String(item.educationLevel).toLowerCase()
    );

    const hasSpecialization =
      item.specialization?.some((s) => s.name || s.code) || false;

    // Fetch integrated specialization options
    if (item.icGroups?.length) {
      fetchIntegratedSpecializations(item.icGroups);
    }

    setFormData([
      {
        educationLevel: selectedOption?.documentTypeId || "",
        course: item.course,
        courseCode: item.qualificationCode || "",
        educationQualificationsId: item.educationQualificationsId || null,

        // KEEP ALL SPECIALIZATIONS
        // Attach icGroups only to the specialization that owns them
        specializationOthers: (item.specialization || []).map((spec) => ({
          ...spec,
          integratedSpecializations: spec.icGroups || [],
        })),

        integratedGroup: item.icGroups || [],

        group: !hasSpecialization ? item.group?.educationGroupId || "" : "",
      },
    ]);

    setErrors([]);
    setIsEditMode(true);
    setEditIndex(index);
    setShowModal(true);
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
