import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import masterApiService from "../../../../master/services/masterApiService";
import { validateStateLanguageForm } from "../../../../../shared/utils/stateLanguageValidations";

// ✅ IMPORT ONLY ONE MAPPER
import { buildStateLanguageData } from "../../StatesLanguages/mappers/stateLanguageMapper";

export const useStateLanguages = () => {

    const { t } = useTranslation(["statelang", "common"]);

    const [stateLangList, setStateLangList] = useState([]);
    const [states, setStates] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        state: "",
        languages: []
    });

    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    /* =========================
       LOAD MASTER DATA
    ========================= */
    useEffect(() => {
        loadMasterData();
    }, []);

    const loadMasterData = async () => {
        try {
            const [statesRes, langRes, mapRes] = await Promise.all([
                masterApiService.getStates(),
                masterApiService.getAllLanguages(),
                masterApiService.getStateLanguages(),
            ]);

            // 🔥 RAW API RESPONSES
            console.log("States API FULL:", statesRes);
            console.log("Languages API FULL:", langRes);
            console.log("Mappings API FULL:", mapRes);

            // 🔥 ACTUAL DATA EXTRACTION
            const states = statesRes?.data || [];
            const languages = langRes?.data || [];
            const mappings = mapRes?.data || [];
            setStates(states);
            setLanguages(languages);


            // 🔥 MAPPER OUTPUT
            const initialData = buildStateLanguageData(
                states,
                mappings,
                languages
            );

            console.log("Mapped Data BEFORE FILTER:", initialData);

            // ⚠️ TEMP: REMOVE FILTER TO DEBUG
            const filteredData = initialData.filter(
                item => item.languageNames.length > 0
            );

            console.log("Mapped Data AFTER FILTER:", filteredData);

            setStateLangList(filteredData);

        } catch (err) {
            console.error("API Error:", err);
        }
    };

    /* =========================
       HANDLE CHANGE
    ========================= */
    const handleChange = (type, payload) => {

        if (type === "state") {
            setFormData(prev => ({
                ...prev,
                state: payload   // ✅ KEEP languages
            }));

            setErrors(prev => ({ ...prev, state: "" }));
        }
        if (type === "setLanguages") {
            setFormData(prev => ({ ...prev, languages: payload }));
            setErrors(prev => ({ ...prev, languages: "" }));
        }
    };

    /* =========================
       ADD
    ========================= */
    const handleAddClick = () => {
        setFormData({ state: "", languages: [] });
        setErrors({});
        setIsEditMode(false);
        setIsViewing(false);
        setEditIndex(null);
        setShowModal(true);
    };

    /* =========================
       CLOSE
    ========================= */
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setIsViewing(false);
        setEditIndex(null);
        setErrors({});
        setFormData({ state: "", languages: [] });
    };
/* =========================
   SAVE
========================= */
const saveStateLanguage = async () => {

    const { valid, errors: newErrors } =
        validateStateLanguageForm(formData, {
            existing: stateLangList,
            currentId: isEditMode ? formData.state : null
        });

    setErrors(newErrors);

    if (!valid) return;

    try {

        const payload = {
            stateId: formData.state,
            languageIds: formData.languages
        };

        console.log("SAVE PAYLOAD:", payload);

        const response =
            await masterApiService.saveStateLanguages(payload);

        if (!response?.success) {
            throw new Error(
                response?.message ||
                "Failed to save state languages"
            );
        }

        toast.success(
            isEditMode
                ? t("statelang:updated_success", "Updated successfully")
                : t("statelang:saved_success", "Saved successfully")
        );

        await loadMasterData();

        handleCloseModal();

    } catch (error) {

        console.error("SAVE ERROR:", error);

        toast.error(
            error?.response?.data?.message ||
            error?.message ||
            "Failed to save state languages"
        );
    }
};

    /* =========================
       EDIT / VIEW
    ========================= */
    const handleEditClick = (item, index) => {
        setFormData({
            state: item.stateId,
            languages: item.languageIds
        });

        setErrors({});
        setIsEditMode(true);
        setIsViewing(false);
        setEditIndex(index);
        setShowModal(true);
    };

    const handleViewClick = (item) => {
        setFormData({
            state: item.stateId,
            languages: item.languageIds
        });

        setErrors({});
        setIsEditMode(false);
        setIsViewing(true);
        setShowModal(true);
    };

    /* =========================
       FILTER
    ========================= */
    const filteredList = stateLangList.filter((item) => {
        const search = searchTerm.toLowerCase();

        if (!search) return true;

        return (
            item.stateName?.toLowerCase().includes(search) ||
            item.languageNames.join(", ").toLowerCase().includes(search)
        );
    });

    return {
        stateLangList: filteredList,
        states,
        languages,
        showModal,
        searchTerm,
        formData,
        errors,
        isEditMode,
        isViewing,

        setSearchTerm,

        handleAddClick,
        handleCloseModal,
        saveStateLanguage,
        handleEditClick,
        handleViewClick,
        handleChange,
    };
};