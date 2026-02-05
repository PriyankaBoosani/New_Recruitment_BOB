import React, { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../../../style/css/AddPosition.css";
import import_Icon from '../../../assets/import_Icon.png'
import ImportModal from "../component/ImportModal";
import EducationModal from "../component/EducationModal";
import { validateAddPosition, validateStateDistribution, validateApprovedOn } from "../validations/validateAddPosition";
import { useCreateJobPosition } from "../hooks/useCreateJobPosition";
import { useRequisitionDetails } from "../hooks/useRequisitionDetails";
import { useMasterData } from "../hooks/useMasterData";
import ConfirmUsePositionModal from "../component/ConfirmUsePositionModal";
import { useJobPositionById } from "../hooks/useJobPositionById";
import { useUpdateJobPosition } from "../hooks/useUpdateJobPosition";
import PositionForm from "../component/PositionForm";
import { mapEduRulesToModalData } from "../mappers/mapEduRulesToModalData";
import { useLocation } from "react-router-dom";
import { useJobPositionsByRequisition } from "../hooks/useJobPositionsByRequisition";
import { toast } from "react-toastify";
import ReservationSection from "../component/ReservationSection";
import { useTranslation } from "react-i18next";
const AddPosition = () => {
    const { t } = useTranslation(["addPosition", "common", "validation"]);
    const renderError = (e) => {
        if (!e) return "";
        if (typeof e === "string") {
            return t(e);
        } if (typeof e === "object" && e.key) {
            return t(e.key, e.params);
        } return "";
    };


    const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
    const MAX_FILE_SIZE_MB = 2;
    const YEAR_OPTIONS = Array.from({ length: 31 }, (_, i) => i);
    const MONTH_OPTIONS = Array.from({ length: 11 }, (_, i) => i + 1);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const { requisitionId } = useParams();
    const positionId = searchParams.get("positionId");
    const mode = location.state?.mode; // "view" | "edit" | undefined

    const isViewMode = !!positionId && mode === "view";
    const isEditMode = !!positionId && mode !== "view";
    const isImportDisabled = isViewMode || isEditMode;
    const {
        positionsByReq,
        fetchPositions
    } = useJobPositionsByRequisition();

    useEffect(() => {
        if (requisitionId) {
            fetchPositions(requisitionId);
        }
    }, [requisitionId]);

    const shouldFetchPosition = !!positionId && (isEditMode || isViewMode);

    const { data: existingPosition } = useJobPositionById(shouldFetchPosition ? positionId : null);
    const { requisition, loading: requisitionLoading } = useRequisitionDetails(requisitionId);
    const { createPosition, loading } = useCreateJobPosition();
    const { updatePosition } = useUpdateJobPosition();
    const masterData = useMasterData();
    const { positions, employmentTypes, reservationCategories, disabilityCategories, educationTypes, qualifications, specializations, certifications, states, languages } = masterData;

    const [errors, setErrors] = useState({});
    const [showImportModal, setShowImportModal] = useState(false);
    const [showEduModal, setShowEduModal] = useState(false);
    const [eduMode, setEduMode] = useState("mandatory");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingPosition, setPendingPosition] = useState(null);
    const [indentFile, setIndentFile] = useState(null);
    const [existingIndentPath, setExistingIndentPath] = useState(null);
    const [existingIndentName, setExistingIndentName] = useState(null);
    const [approvedBy, setApprovedBy] = useState("");
    const [approvedOn, setApprovedOn] = useState("");
    const [stateDistributions, setStateDistributions] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [nationalCategories, setNationalCategories] = useState({});
    const [nationalDisabilities, setNationalDisabilities] = useState({});
    const [currentState, setCurrentState] = useState({ state: "", vacancies: "", language: "", categories: {}, disabilities: {} });
    const [formData, setFormData] = useState({
        department: "", position: "", vacancies: "", minAge: "", maxAge: "",
        employmentType: "", contractualPeriod: "", grade: "", enableLocation: false,
        mandatoryEducation: "", preferredEducation: "",
        mandatoryExperience: { years: "", months: "", description: "" },
        preferredExperience: { years: "", months: "", description: "" },
        responsibilities: "", medicalRequired: "", enableStateDistribution: false
    });

    const [educationData, setEducationData] = useState({
        mandatory: { educations: [], certificationIds: [], text: "" },
        preferred: { educations: [], certificationIds: [], text: "" }
    });
    const eduInitializedRef = useRef(false);


    // --- EFFECTS ---
    useEffect(() => {
        if (!existingPosition || !employmentTypes.length) return;
        const isContract =
            employmentTypes.find(
                t =>
                    String(t.id) === String(existingPosition.employmentType) &&
                    t.label?.toLowerCase().includes("contract")
            ) !== undefined;


        setFormData({
            department: String(existingPosition.deptId),
            position: String(existingPosition.masterPositionId),
            vacancies: existingPosition.totalVacancies,
            minAge: existingPosition.eligibilityAgeMin,
            maxAge: existingPosition.eligibilityAgeMax,
            employmentType: existingPosition.employmentType,
            contractualPeriod:
                existingPosition.employmentType?.toLowerCase().includes("contract")
                    ? existingPosition.contractYears || ""
                    : "",
            grade: existingPosition.gradeId,
            enableLocation: existingPosition.isLocationPreferenceEnabled,
            responsibilities: existingPosition.rolesResponsibilities,
            medicalRequired: existingPosition.isMedicalRequired ? "yes" : "no",
            enableStateDistribution: existingPosition.isLocationWise,
            mandatoryExperience: {
                years: Math.floor(existingPosition.mandatoryExperienceMonths / 12),
                months: existingPosition.mandatoryExperienceMonths % 12,
                description: existingPosition.mandatoryExperience,
            },
            preferredExperience: {
                years: Math.floor(existingPosition.preferredExperienceMonths / 12),
                months: existingPosition.preferredExperienceMonths % 12,
                description: existingPosition.preferredExperience,
            },
            contractualPeriod: isContract
                ? String(existingPosition.contractYears ?? "")
                : "",
        });
        setApprovedBy(existingPosition.approvedBy || "");
        setApprovedOn(existingPosition.approvedOn || "");
        if (existingPosition.indentPath) setExistingIndentPath(existingPosition.indentPath);
        setExistingIndentName(existingPosition.indentName);


    }, [existingPosition, employmentTypes]);

    useEffect(() => {
        if (!employmentTypes.length) return;

        const isContract =
            employmentTypes.find(
                t =>
                    String(t.id) === String(formData.employmentType) &&
                    t.label?.toLowerCase().includes("contract")
            ) !== undefined;

        // 🔥 if user switches away from contract, clear it
        if (!isContract && formData.contractualPeriod !== "") {
            setFormData(prev => ({
                ...prev,
                contractualPeriod: ""
            }));
        }
    }, [formData.employmentType, employmentTypes]);

    useEffect(() => {
        if (!existingPosition) return;

        if (
            !educationTypes.length ||
            !qualifications.length ||
            !specializations.length ||
            !certifications.length
        ) {
            return;
        }

        if (eduInitializedRef.current) return;

        const mandatory = mapEduRulesToModalData(
            existingPosition.mandatoryEduRulesJson,
            educationTypes,
            qualifications,
            specializations,
            certifications
        );

        const preferred = mapEduRulesToModalData(
            existingPosition.preferredEduRulesJson,
            educationTypes,
            qualifications,
            specializations,
            certifications
        );

        setEducationData({
            mandatory: {
                ...mandatory,
                //  USE BACKEND TEXT — DO NOT REBUILD
                text: existingPosition.mandatoryEducation || ""
            },
            preferred: {
                ...preferred,
                //  USE BACKEND TEXT — DO NOT REBUILD
                text: existingPosition.preferredEducation || ""
            }
        });


        eduInitializedRef.current = true;
    }, [
        existingPosition,
        educationTypes,
        qualifications,
        specializations,
        certifications
    ]);


    // Handle National Distribution mapping
    useEffect(() => {
        if (!existingPosition || existingPosition.isLocationWise || !reservationCategories.length || !disabilityCategories.length) return;
        const natCat = {}; const natDis = {};
        reservationCategories.forEach(c => (natCat[c.code] = 0));
        disabilityCategories.forEach(d => (natDis[d.disabilityCode] = 0));
        existingPosition.positionCategoryNationalDistributions.forEach(d => {
            if (d.isDisability) {
                const dis = disabilityCategories.find(x => x.id === d.disabilityCategoryId);
                if (dis) natDis[dis.disabilityCode] = d.vacancyCount;
            } else {
                const cat = reservationCategories.find(x => x.id === d.reservationCategoryId);
                if (cat) natCat[cat.code] = d.vacancyCount;
            }
        });
        setNationalCategories(natCat);
        setNationalDisabilities(natDis);
    }, [existingPosition, reservationCategories, disabilityCategories]);

    // Handle State Distribution mapping
    useEffect(() => {
        if (!existingPosition || !existingPosition.isLocationWise || !reservationCategories.length || !disabilityCategories.length) return;
        const mappedStates = existingPosition.positionStateDistributions.map(sd => {
            const categories = {}; const disabilities = {};
            reservationCategories.forEach(c => (categories[c.code] = 0));
            disabilityCategories.forEach(d => (disabilities[d.disabilityCode] = 0));
            sd.positionCategoryDistributions.forEach(d => {
                if (d.isDisability) {
                    const dis = disabilityCategories.find(x => x.id === d.disabilityCategoryId);
                    if (dis) disabilities[dis.disabilityCode] = d.vacancyCount;
                } else {
                    const cat = reservationCategories.find(x => x.id === d.reservationCategoryId);
                    if (cat) categories[cat.code] = d.vacancyCount;
                }
            });
            return {
                positionStateDistributionId: sd.positionStateDistributionId,
                state: sd.stateId, vacancies: sd.totalVacancies, language: sd.localLanguage,
                categories, disabilities,
                categoryDistributions: sd.positionCategoryDistributions.map(cd => ({
                    positionCategoryDistributionId: cd.positionCategoryDistributionId,
                    reservationCategoryId: cd.reservationCategoryId,
                    disabilityCategoryId: cd.disabilityCategoryId,
                    isDisability: cd.isDisability
                }))
            };
        });
        setStateDistributions(mappedStates);
    }, [existingPosition, reservationCategories, disabilityCategories]);

    // --- HANDLERS ---
    const numericFields = [
        "vacancies",
        "minAge",
        "maxAge",
        "contractualPeriod"
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // handle nested fields
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
            setErrors(prev => ({ ...prev, [parent]: "" }));
            return;
        }

        let finalValue = value;

        if (numericFields.includes(name)) {
            finalValue = value.replace(/\D/g, "");
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : finalValue
        }));

        //  SPECIAL CASE: department change clears position error
        if (name === "department") {
            setErrors(prev => ({
                ...prev,
                department: "",
                position: ""
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
        if (name === "vacancies") {
            setErrors(prev => ({
                ...prev,
                vacancies: "",
                nationalDistribution: ""
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }

    };
    const resetPositionDerivedFields = {
        minAge: "",
        maxAge: "",
        grade: "",
        responsibilities: "",
        mandatoryExperience: { years: "", months: "", description: "" },
        preferredExperience: { years: "", months: "", description: "" }
    };
    const handleRejectPositionData = () => {
        setFormData(prev => ({
            ...prev,
            ...resetPositionDerivedFields
        }));

        // clear related errors
        setErrors(prev => {
            const {
                minAge,
                maxAge,
                grade,
                responsibilities,
                mandatoryExperience,
                preferredExperience,
                mandatoryEducation,
                preferredEducation,
                ...rest
            } = prev;
            return rest;
        });

        setPendingPosition(null);
        setShowConfirmModal(false);
    };


    const onPositionSelect = (id) => {
        const selected = positions.find(p => String(p.id) === String(id));
        if (!selected) return;

        setFormData(prev => ({
            ...prev,
            position: id
        }));

        // CLEAR BOTH ERRORS
        setErrors(prev => ({
            ...prev,
            position: "",
            department: ""
        }));

        setPendingPosition(selected);
        setShowConfirmModal(true);
    };


    const handleUsePositionData = () => {
        if (!pendingPosition) return;
        setFormData(prev => ({
            ...prev,
            minAge: pendingPosition.minAge ?? "",
            maxAge: pendingPosition.maxAge ?? "",
            grade: String(pendingPosition.gradeId ?? ""),
            responsibilities: pendingPosition.rolesResponsibilities ?? "",
            mandatoryExperience: { ...prev.mandatoryExperience, description: pendingPosition.mandatoryExperience ?? "" },
            preferredExperience: { ...prev.preferredExperience, description: pendingPosition.preferredExperience ?? "" }
        }));
        setErrors(prev => ({
            ...prev,
            minAge: "",
            maxAge: "",
            grade: "",
            responsibilities: "",
            mandatoryExperience: "",
            preferredExperience: "",
            mandatoryEducation: "",
            preferredEducation: ""
        }));
        setPendingPosition(null);
        setShowConfirmModal(false);
    };

    const handleAddOrUpdateState = () => {

        const newErrors = validateStateDistribution({
            currentState,
            stateDistributions,
            editingIndex
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...newErrors }));
            return;
        }
        const deletedIndex = stateDistributions.findIndex(
            s => s.state === currentState.state && s.__deleted
        );

        if (deletedIndex !== -1) {
            const revived = [...stateDistributions];
            revived[deletedIndex] = {
                ...revived[deletedIndex], // keeps positionStateDistributionId
                ...currentState,
                __deleted: false
            };

            setStateDistributions(revived);
            setCurrentState({
                state: "",
                vacancies: "",
                language: "",
                categories: {},
                disabilities: {}
            });
            setEditingIndex(null);
            return;
        }
        const updated = [...stateDistributions];
        if (editingIndex !== null) updated[editingIndex] = { ...updated[editingIndex], ...currentState };
        else updated.push({ ...currentState });

        setStateDistributions(updated);

        //  CLEAR NATIONAL DISTRIBUTION ERROR
        setErrors(prev => {
            const { nationalDistribution, ...rest } = prev;
            return rest;
        });

        setCurrentState({
            state: "",
            vacancies: "",
            language: "",
            categories: {},
            disabilities: {}
        });
        setEditingIndex(null);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateAddPosition({
            isEditMode,
            formData,
            educationData,
            indentFile,
            approvedBy,
            approvedOn,
            existingIndentPath,
            existingIndentName,
            nationalCategories,
            nationalDisabilities,
            stateDistributions,
            existingPositions: positionsByReq[requisitionId] || [],
            positionId
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            formData,
            educationData,
            requisitionId,
            indentFile,
            approvedBy,
            approvedOn,
            reservationCategories,
            disabilityCategories,
            nationalCategories,
            nationalDisabilities,
            qualifications,
            certifications,
            stateDistributions: stateDistributions.filter(s => !s.__deleted)
        };

        try {
            if (isEditMode) {
                await updatePosition({ ...payload, positionId, existingPosition });
                toast.success(t("position_updated_success"));
            } else {
                await createPosition(payload);
                toast.success(t("position_added_success"));
            }

            navigate(-1);
        } catch (err) {
            toast.error(err.message || t("operation_failed"));
        }
    };


    const nationalCategoryTotal = Object.values(nationalCategories).reduce((a, b) => a + Number(b || 0), 0);
    const stateCategoryTotal = Object.values(currentState.categories || {}).reduce((a, b) => a + Number(b || 0), 0);
    const filteredLanguages = currentState.state ? languages.filter(l => l.name === states.find(s => s.id === currentState.state)?.localLanguage) : [];

    return (
        <Container fluid className="add-position-page">
            <div className="req_top-bar">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="link" className="back-btn" onClick={() => navigate(-1)}>← {t("back")}</Button>
                    <div>
                        <span className="req-id">{requisitionLoading ? t("loading") : requisition?.requisitionCode || "—"}</span>
                        <div className="req-code">{requisition?.requisitionTitle || "—"}</div>
                    </div>
                </div>
                <Button
                    className="imprcls"
                    variant="none"
                    disabled={isImportDisabled}
                    onClick={() => setShowImportModal(true)}
                >
                    <img src={import_Icon} alt="import_Icon" className="icon-14" />
                    &nbsp;{t("import_positions")}
                </Button>

            </div>

            <Card className="position-card">
                <Card.Body>
                    <div className="section-title"><span className="indicator"></span><h6> {isViewMode
                        ? t("view_position")
                        : isEditMode
                            ? t("edit_position")
                            : t("add_position")}</h6>
                    </div>
                    <Form onSubmit={handleSubmit}>

                        <PositionForm

                            isViewMode={isViewMode} formData={formData} errors={errors} handleInputChange={handleInputChange} indentFile={indentFile} setFormData={setFormData}
                            existingIndentPath={existingIndentPath} existingIndentName={existingIndentName} setIndentFile={setIndentFile} setErrors={setErrors}
                            approvedBy={approvedBy} setApprovedBy={setApprovedBy} approvedOn={approvedOn} setApprovedOn={setApprovedOn} validateApprovedOn={validateApprovedOn}
                            masterData={masterData} onPositionSelect={onPositionSelect} educationData={educationData}
                            onEducationClick={(m) => { if (isViewMode) return; setEduMode(m); setShowEduModal(true); }} YEAR_OPTIONS={YEAR_OPTIONS} MONTH_OPTIONS={MONTH_OPTIONS} ALLOWED_EXTENSIONS={ALLOWED_EXTENSIONS} MAX_FILE_SIZE_MB={MAX_FILE_SIZE_MB}
                        />
                        <ReservationSection
                            isViewMode={isViewMode} formData={formData} errors={errors} setErrors={setErrors} reservationCategories={reservationCategories}
                            disabilityCategories={disabilityCategories} states={states} languages={languages} nationalCategories={nationalCategories} setNationalCategories={setNationalCategories} nationalDisabilities={nationalDisabilities}
                            setNationalDisabilities={setNationalDisabilities} nationalCategoryTotal={nationalCategoryTotal}
                            currentState={currentState} setCurrentState={setCurrentState} stateCategoryTotal={stateCategoryTotal}
                            filteredLanguages={filteredLanguages} stateDistributions={stateDistributions} setStateDistributions={setStateDistributions} editingIndex={editingIndex}
                            setEditingIndex={setEditingIndex} handleInputChange={handleInputChange} handleAddOrUpdateState={handleAddOrUpdateState}
                        />


                        <div className="form-footer mt-4 mb-4">
                            <Button variant="outline-secondary" className="cancelbtn" onClick={() => navigate(-1)}>{t("common:cancel")}</Button>
                            {!isViewMode && (
                                <Button
                                    type="submit"
                                    className="ms-2 save-btn"
                                    disabled={loading}
                                >
                                    {isEditMode ? t("common:update") : t("common:save")}
                                </Button>
                            )}

                        </div>

                    </Form>
                </Card.Body>
            </Card>

            <ImportModal show={showImportModal} onHide={() => setShowImportModal(false)} requisitionId={requisitionId} onSuccess={() => fetchPositions(requisitionId)} // optional but correct
            />
            <EducationModal key={`${eduMode}-${showEduModal}`} show={showEduModal} mode={eduMode} initialData={educationData[eduMode]} educationTypes={educationTypes} qualifications={qualifications} specializations={specializations} certifications={certifications} onHide={() => setShowEduModal(false)} onSave={({ educations, certificationIds, text }) => { setEducationData(prev => ({ ...prev, [eduMode]: { educations, certificationIds, text } })); setErrors(prev => { const upd = { ...prev }; delete upd[`${eduMode}Education`]; return upd; }); }} />
            <ConfirmUsePositionModal show={showConfirmModal} onYes={handleUsePositionData} onNo={handleRejectPositionData}
            />
        </Container>
    );
};

export default AddPosition;