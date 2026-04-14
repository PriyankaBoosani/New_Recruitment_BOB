import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  validateEducationForm,
  validateEducationLevel,
  validateCourse,
  validateSpecialization
} from "../../../../../shared/utils/educationValidations";
import { useTranslation } from "react-i18next";

import masterApiService from "../../../services/masterApiService";
import { mapEducationListFromApi } from "../mappers/educationMapper"; // ✅ ADD

export const useExperience = () => {
  const { t } = useTranslation(["education", "common"]);

  const [experienceList, setExperienceList] = useState([]); // table
  const [educationOptions, setEducationOptions] = useState([]); // dropdown
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState([
    {
      educationLevel: "",
      course: "",
      educationQualificationsId: "",
      specializationOthers: [{ name: "", id: "" }]
    },
  ]);

  const [errors, setErrors] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // 🔥 GET API → DROPDOWN
  const fetchEducationOptions = async () => {
    try {
      setLoading(true);

      const res = await masterApiService.getAllDocumentTypes();

      const list = res.data || [];
      const filtered = list.filter(
        (item) => item?.docType?.toLowerCase() === "educationdocs"
      );
      setEducationOptions(filtered);

      const ids = filtered.map(item => item.documentTypeId);

      return { ids, filtered }; // ✅ return both
    } catch (err) {
      toast.error("Failed to fetch education dropdown");
      return { ids: [], filtered: [] };
    } finally {
      setLoading(false);
    }
  };

  // 🔥 POST API → TABLE (WITH IDS)
  const fetchEducationByIds = async (ids, educationOptionsList) => {
    try {
      setLoading(true);

      const res = await masterApiService.getAllEducation(ids);

      const list = res.data || [];

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
    const { ids, filtered } = await fetchEducationOptions();

    if (ids?.length) {
      await fetchEducationByIds(ids, filtered); // ✅ pass directly
    }
  };

  // 🔥 HANDLE CHANGE
  const handleFieldChange = (formIndex, field, value, specIndex = null) => {
    const regex = /^[A-Za-z\s.&,()\-_/]*$/;

    if (field === "course" || field === "specialization") {
      if (!regex.test(value)) return;
    }

    const updated = [...formData];

    if (field === "specialization") {
      updated[formIndex].specializationOthers[specIndex].name = value;
    } else {
      updated[formIndex][field] = value;
    }

    setFormData(updated);

    if (field === "educationLevel") {
      console.log("Selected ID:", value); // ✅ check ID

    }

    let fieldError = null;

    if (field === "educationLevel") {
      fieldError = validateEducationLevel(value);
    }

    if (field === "course") {
      fieldError = validateCourse(value);
    }

    if (field === "specialization") {
      fieldError = validateSpecialization(
        updated[formIndex].specializationOthers
      );
    }

    const updatedErrors = [...errors];
    if (!updatedErrors[formIndex]) updatedErrors[formIndex] = {};

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
      id: null // ✅ dynamic id
    });
    setFormData(updated);
  };

  const handleRemoveSpec = (formIndex, i) => {
    const updated = [...formData];
    updated[formIndex].specializationOthers =
      updated[formIndex].specializationOthers.filter((_, idx) => idx !== i);
    setFormData(updated);
  };

  const handleAddClick = () => {
    setFormData([
      {
        educationLevel: "",
        course: "",
        specializationOthers: [{ name: "", id: "" }]
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
  };

  const saveExperience = async () => {
    try {
      const { valid, errors: newErrors } = validateEducationForm(formData[0], {
        existing: experienceList,   // 🔥 REQUIRED
        currentId: formData[0].educationQualificationsId
      });
      setErrors([newErrors]);
      console.log("Payload to save", valid); // ✅ check payload

      if (!valid) return;
      console.log("Payload to save111", formData[0].specializationOthers); // ✅ check payload

      const payload = {
        qualification: {
          levelId: formData[0].educationLevel,
          qualificationName: formData[0].course,   // ✅ use course as name
          qualificationCode: formData[0].course,   // ✅ simple fix
          displayOrder: 0,
          educationQualificationsId: formData[0].educationQualificationsId || null, // ✅ include ID for edit
        },
        specializations: formData[0].specializationOthers
          .filter((s) => s?.name?.trim()).map((s) => ({
            specializationName: s.name.trim(),
            specializationCode: s.name.trim(),   // ✅ dynamic
            specializationId: s.id || null,     // ✅ dynamic
          }))
      };

      const res = await masterApiService.saveEducation(payload);

      const saved = res.data;

      const levelId = String(saved?.qualification?.levelId || "").toLowerCase();

      // 🔥 Create lookup map (same as before)
      const docMap = new Map(
        educationOptions.map(opt => [
          String(opt.documentTypeId).toLowerCase(),
          opt.documentName
        ])
      );

      // 🔥 Get documentName using levelId
      const documentName = docMap.get(levelId);

      const mapped = {
        educationLevel: documentName || "-", // ✅ FIXED
        course: saved?.qualification?.qualificationName || "-",
        specialization:
          saved?.specializations?.map((s) => ({
            name: s.specializationName,
            id: s.specializationId
          })) || [],
        educationQualificationsId: saved?.qualification?.educationQualificationsId || "-",
      };

      await loadData();  // ✅ REFETCH TABLE DATA

      if (isEditMode) {
        toast.success(t("education:updated_success"));
      } else {
        toast.success(t("education:saved_success"));
      }

      setShowModal(false);
      setIsEditMode(false);
      setEditIndex(null);

    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const handleDelete = (index) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== index));
    toast.success(t("education:deleted_success"));
  };

  const handleEditClick = (item, index) => {
    // 🔥 Convert NAME → ID
    const selectedOption = educationOptions.find(
      (opt) =>
        opt.documentName.toLowerCase() ===
        String(item.educationLevel).toLowerCase()
    );

    setFormData([
      {
        educationLevel: selectedOption?.documentTypeId || "", // ✅ FIXED
        course: item.course,
        educationQualificationsId: item.educationQualificationsId || null,
        specializationOthers:
          item.specialization?.length > 0
            ? item.specialization.map((s) => ({
              name: s.name,
              id: s.id
            }))
            : [{ name: "", id: "" }],
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

    const educationMatch =
      item.educationLevel?.toLowerCase().includes(search);

    const courseMatch =
      item.course?.toLowerCase().includes(search);

    const specializationMatch =
      item.specialization?.some((s) =>
        s.name?.toLowerCase().includes(search)
      );

    return educationMatch || courseMatch || specializationMatch;
  });

  return {
    experienceList: filteredList,
    educationOptions, // ✅ dropdown
    loading,
    showModal,
    searchTerm,
    formData,
    errors,
    currentPage,
    pageSize,
    isEditMode,

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
  };
};