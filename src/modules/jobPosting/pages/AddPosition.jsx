import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../../../style/css/AddPosition.css";
import import_Icon from '../../../assets/import_Icon.png'
import delete_icon from '../../../assets/delete_icon.png'
import edit_icon from '../../../assets/edit_icon.png'
import ImportModal from "../component/ImportModal";
import EducationModal from "../component/EducationModal";
import { validateAddPosition, validateStateDistribution } from "../validations/validateAddPosition";
import ErrorMessage from "../../../shared/components/ErrorMessage";
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

const AddPosition = () => {
    const POSITION_POPULATED_FIELDS = ["Min Age", "Max Age", "Grade / Scale", "Roles & Responsibilities", "Mandatory Education", "Preferred Education", "Mandatory Experience", "Preferred Experience"];
    const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
    const MAX_FILE_SIZE_MB = 2;
    const YEAR_OPTIONS = Array.from({ length: 31 }, (_, i) => i);
    const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const { requisitionId } = useParams();
    const positionId = searchParams.get("positionId");
    const mode = location.state?.mode; // "view" | "edit" | undefined

    // const isViewMode = mode === "view";
    // const isEditMode = mode === "view" && !!positionId;
    const isAddMode = !mode || mode === "add";
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

    const { data: existingPosition, loading: positionLoading } = useJobPositionById(shouldFetchPosition ? positionId : null);
    const { requisition, loading: requisitionLoading } = useRequisitionDetails(requisitionId);
    const { createPosition, loading } = useCreateJobPosition();
    const { updatePosition } = useUpdateJobPosition();
    const masterData = useMasterData();
    const { departments, positions, jobGrades, employmentTypes, reservationCategories, disabilityCategories, users, educationTypes, qualifications, specializations, certifications, states, languages } = masterData;

    const [errors, setErrors] = useState({});
    const [showImportModal, setShowImportModal] = useState(false);
    const [showEduModal, setShowEduModal] = useState(false);
    const [eduMode, setEduMode] = useState("mandatory");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingPosition, setPendingPosition] = useState(null);
    const [indentFile, setIndentFile] = useState(null);
    const [existingIndentPath, setExistingIndentPath] = useState(null);
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
        if (!existingPosition) return;
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
        });
        setApprovedBy(existingPosition.approvedBy || "");
        setApprovedOn(existingPosition.approvedOn || "");
        if (existingPosition.indentPath) setExistingIndentPath(existingPosition.indentPath);

    }, [existingPosition]);

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

        // 🔥 SPECIAL CASE: department change clears position error
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



    const onPositionSelect = (id) => {
        const selected = positions.find(p => String(p.id) === String(id));
        if (!selected) return;

        setFormData(prev => ({
            ...prev,
            position: id
        }));

        // 🔥 CLEAR BOTH ERRORS
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
        setEducationData(prev => ({
            mandatory: {
                ...prev.mandatory,
                text:
                    prev.mandatory.text?.trim()
                        ? prev.mandatory.text // 🔒 KEEP USER INPUT
                        : pendingPosition.mandatoryEducation ?? ""
            },
            preferred: {
                ...prev.preferred,
                text:
                    prev.preferred.text?.trim()
                        ? prev.preferred.text // 🔒 KEEP USER INPUT
                        : pendingPosition.preferredEducation ?? ""
            }
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
            isEditMode, formData, educationData, indentFile, approvedBy, approvedOn, existingIndentPath, nationalCategories, nationalDisabilities, stateDistributions, existingPositions: positionsByReq[requisitionId] || [],
            positionId
        });
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

        const payload = { formData, educationData, requisitionId, indentFile, approvedBy, approvedOn, reservationCategories, disabilityCategories, nationalCategories, nationalDisabilities, qualifications, certifications, stateDistributions: stateDistributions.filter(s => !s.__deleted) };
        const success = isEditMode ? await updatePosition({ ...payload, positionId, existingPosition }) : await createPosition(payload);
        if (success) {
            toast.success(
                isEditMode
                    ? "Position updated successfully"
                    : "Position added successfully"
            );

            navigate(-1);
        }

    };

    const nationalCategoryTotal = Object.values(nationalCategories).reduce((a, b) => a + Number(b || 0), 0);
    const stateCategoryTotal = Object.values(currentState.categories || {}).reduce((a, b) => a + Number(b || 0), 0);
    const filteredLanguages = currentState.state ? languages.filter(l => l.name === states.find(s => s.id === currentState.state)?.localLanguage) : [];

    return (
        <Container fluid className="add-position-page">
            <div className="req_top-bar">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="link" className="back-btn" onClick={() => navigate(-1)}>← Back</Button>
                    <div>
                        <span className="req-id">{requisitionLoading ? "Loading..." : requisition?.requisitionCode || "—"}</span>
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
                    &nbsp;Import Positions
                </Button>

            </div>

            <Card className="position-card">
                <Card.Body>
                    <div className="section-title"><span className="indicator"></span><h6> {isViewMode ? "View Position" : isEditMode ? "Edit Position" : "Add New Position"}</h6>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <fieldset disabled={isViewMode}>
                            <PositionForm
                                isViewMode={isViewMode} formData={formData} errors={errors} handleInputChange={handleInputChange} indentFile={indentFile} setFormData={setFormData}
                                existingIndentPath={existingIndentPath} setIndentFile={setIndentFile} setErrors={setErrors}
                                approvedBy={approvedBy} setApprovedBy={setApprovedBy} approvedOn={approvedOn} setApprovedOn={setApprovedOn}
                                masterData={masterData} onPositionSelect={onPositionSelect} educationData={educationData}
                                onEducationClick={(m) => { if (isViewMode) return; setEduMode(m); setShowEduModal(true); }} YEAR_OPTIONS={YEAR_OPTIONS} MONTH_OPTIONS={MONTH_OPTIONS} ALLOWED_EXTENSIONS={ALLOWED_EXTENSIONS} MAX_FILE_SIZE_MB={MAX_FILE_SIZE_MB}
                            />

                            {/* Reservation Section */}
                            <Col xs={12} className="mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2 catfonts">
                                    <div><h6 className="mb-0 catfont">Category Wise Reservation <span className="text-danger">*</span></h6><small className="text-muted">Enable to distribute vacancies across states</small></div>
                                    <Form.Check
                                        type="switch"
                                        name="enableStateDistribution"
                                        checked={formData.enableStateDistribution}
                                        onChange={e => {
                                            handleInputChange(e);

                                            //  CLEAR NATIONAL DISTRIBUTION ERROR
                                            setErrors(prev => ({ ...prev, nationalDistribution: "" }));
                                        }}
                                    />
                                </div>

                                {!formData.enableStateDistribution ? (
                                    <Row className="g-4">
                                        <Col md={7}>
                                            <Card className="p-3 genfonts"><h6 className="text-primary mb-3">General Category</h6>
                                                <Row className="g-3">
                                                    {reservationCategories.map(cat => (
                                                        <Col md={2} key={cat.id}>
                                                            <Form.Label className="small fw-semibold">{cat.code}</Form.Label>
                                                            <Form.Control
                                                                type="number"
                                                                value={nationalCategories[cat.code] ?? 0}
                                                                onChange={e => {
                                                                    setNationalCategories(prev => ({
                                                                        ...prev,
                                                                        [cat.code]: Number(e.target.value || 0)
                                                                    }));

                                                                    //  CLEAR NATIONAL DISTRIBUTION ERROR
                                                                    setErrors(prev => ({ ...prev, nationalDistribution: "" }));
                                                                }}
                                                            />
                                                        </Col>
                                                    ))}
                                                    <Col md={2}><Form.Label className="small fw-semibold">Total</Form.Label><Form.Control disabled value={nationalCategoryTotal} /></Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                        <Col md={5}>
                                            <Card className="p-3 genfonts"><h6 className="text-primary mb-3">Disability Category</h6>
                                                <Row className="g-3">
                                                    {disabilityCategories.map(d => (
                                                        <Col md={3} key={d.id}><Form.Label className="small fw-semibold">{d.disabilityCode}</Form.Label>
                                                            <Form.Control type="number" value={nationalDisabilities[d.disabilityCode] ?? 0} onChange={e => {
                                                                setNationalDisabilities(prev => ({
                                                                    ...prev,
                                                                    [d.disabilityCode]: Number(e.target.value || 0)
                                                                }));

                                                                // 🔥 CLEAR CROSS-FIELD ERROR
                                                                setErrors(prev => ({
                                                                    ...prev,
                                                                    nationalDistribution: ""
                                                                }));
                                                            }}
                                                            />
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                ) : (
                                    <>
                                        <Row className="g-3 mb-3">
                                            <Col md={4}><Form.Label>State <span className="text-danger">*</span></Form.Label><Form.Select
                                                value={currentState.state}
                                                onChange={e => {
                                                    setCurrentState(prev => ({ ...prev, state: e.target.value }));
                                                    setErrors(prev => ({ ...prev, state: "" }));
                                                }} >
                                                <option value="">Select State</option>{states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Form.Select>
                                                <ErrorMessage>{errors.state}</ErrorMessage></Col>
                                            <Col md={4}><Form.Label>Vacancies <span className="text-danger">*</span></Form.Label><Form.Control
                                                type="number"
                                                value={currentState.vacancies}
                                                onChange={e => {
                                                    setCurrentState(prev => ({
                                                        ...prev,
                                                        vacancies: e.target.value
                                                    }));

                                                    setErrors(prev => ({
                                                        ...prev,
                                                        stateVacancies: "",
                                                        stateDistribution: ""   // 🔥 CLEAR CROSS-FIELD ERROR
                                                    }));
                                                }}

                                            />
                                                <ErrorMessage>{errors.stateVacancies}</ErrorMessage>
                                            </Col>
                                            <Col md={4}><Form.Label>Local Language <span className="text-danger">*</span></Form.Label>
                                                <Form.Select
                                                    value={currentState.language}
                                                    disabled={!currentState.state}
                                                    onChange={e => {
                                                        setCurrentState(prev => ({
                                                            ...prev,
                                                            language: e.target.value
                                                        }));
                                                        setErrors(prev => ({ ...prev, stateLanguage: "" }));
                                                    }}
                                                >
                                                    <option value="">Select Language</option>
                                                    {filteredLanguages.map(lang => (
                                                        <option key={lang.id} value={lang.id}>
                                                            {lang.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>

                                                <ErrorMessage>{errors.stateLanguage}</ErrorMessage></Col>
                                        </Row>
                                        <Row className="g-4 mt-3">
                                            <Col md={7}>
                                                <Card className="p-3 h-100 genfonts"><h6 className="text-primary mb-3">General Category</h6>
                                                    <Row className="g-3">
                                                        {reservationCategories.map(cat => (
                                                            <Col md={2} key={cat.id}><Form.Label className="small fw-semibold">{cat.code}</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={currentState.categories?.[cat.code] ?? 0}
                                                                    onChange={e => {
                                                                        setCurrentState(prev => ({
                                                                            ...prev,
                                                                            categories: {
                                                                                ...prev.categories,
                                                                                [cat.code]: Number(e.target.value || 0)
                                                                            }
                                                                        }));

                                                                        // 🔥 CLEAR CROSS-FIELD ERROR
                                                                        setErrors(prev => ({
                                                                            ...prev,
                                                                            stateDistribution: ""
                                                                        }));
                                                                    }}
                                                                />
                                                            </Col>
                                                        ))}
                                                        <Col md={2}><Form.Label className="small fw-semibold">Total</Form.Label><Form.Control disabled value={stateCategoryTotal} /></Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                            <Col md={5}>
                                                <Card className="p-3 h-100 genfonts"><h6 className="text-primary mb-3">Disability Category</h6>
                                                    <Row className="g-3">
                                                        {disabilityCategories.map(d => (
                                                            <Col md={3} key={d.id}><Form.Label className="small fw-semibold">{d.disabilityCode}</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={currentState.disabilities?.[d.disabilityCode] ?? 0}
                                                                    onChange={e => {
                                                                        setCurrentState(prev => ({
                                                                            ...prev,
                                                                            disabilities: {
                                                                                ...prev.disabilities,
                                                                                [d.disabilityCode]: Number(e.target.value || 0)
                                                                            }
                                                                        }));

                                                                        // 🔥 CLEAR CROSS-FIELD ERROR
                                                                        setErrors(prev => ({
                                                                            ...prev,
                                                                            stateDistribution: ""
                                                                        }));
                                                                    }}
                                                                />

                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <ErrorMessage>{errors.stateDistribution}</ErrorMessage>

                                        <div className="addsubmitbtn">
                                            <Button className="mt-3 addstatefont" onClick={handleAddOrUpdateState}>{editingIndex !== null ? "Update State" : "Add State"}</Button>
                                        </div>
                                        <div className="table-responsive mt-4">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th rowSpan="2">S No.</th>
                                                        <th rowSpan="2">State Name</th>
                                                        <th rowSpan="2">Vacancies</th>
                                                        <th rowSpan="2">Local Language of State</th>

                                                        <th rowSpan="2">GEN</th>
                                                        <th rowSpan="2">EWS</th>
                                                        <th rowSpan="2">SC</th>
                                                        <th rowSpan="2">ST</th>
                                                        <th rowSpan="2">OBC</th>
                                                        <th rowSpan="2">TOTAL</th>

                                                        <th colSpan="5" className="text-center">Out of Which</th>

                                                        <th rowSpan="2" className="text-center">Actions</th>
                                                    </tr>

                                                    <tr>
                                                        <th>HI</th>
                                                        <th>VI</th>
                                                        <th>OC</th>
                                                        <th>ID</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {stateDistributions
                                                        .filter(row => !row.__deleted)
                                                        .map((row, idx) => (

                                                            <tr key={idx}>
                                                                <td>{idx + 1}</td><td>{states.find(s => s.id === row.state)?.name}</td><td>{row.vacancies}</td><td>{languages.find(l => l.id === row.language)?.name}</td>
                                                                {reservationCategories.map(c => <td key={c.code}>{row.categories?.[c.code] ?? 0}</td>)}
                                                                <td>{Object.values(row.categories || {}).reduce((a, b) => a + Number(b || 0), 0)}</td>
                                                                {disabilityCategories.map(d => <td key={d.disabilityCode}>{row.disabilities?.[d.disabilityCode] ?? 0}</td>)}
                                                                <td>{Object.values(row.disabilities || {}).reduce((a, b) => a + Number(b || 0), 0)}</td>
                                                                <td className="text-center"><Button size="sm" variant="link" className="p-0" onClick={() => { setEditingIndex(idx); setCurrentState({ ...row }); }}><img src={edit_icon} alt="edit_icon" className="icon-16" /></Button><Button size="sm" variant="link" className="text-danger" onClick={() => {
                                                                    setStateDistributions(prev =>
                                                                        prev.map((s, i) =>
                                                                            i === idx ? { ...s, __deleted: true } : s
                                                                        )
                                                                    );

                                                                    // if deleting the row being edited
                                                                    if (editingIndex === idx) {
                                                                        setEditingIndex(null);
                                                                        setCurrentState({
                                                                            state: "",
                                                                            vacancies: "",
                                                                            language: "",
                                                                            categories: {},
                                                                            disabilities: {}
                                                                        });
                                                                    }
                                                                }}
                                                                ><img src={delete_icon} alt="delete_icon" className="icon-16" /></Button></td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                                <ErrorMessage>{errors.nationalDistribution}</ErrorMessage>

                            </Col>
                        </fieldset>
                        <div className="form-footer mt-4 mb-4">
                            <Button variant="outline-secondary" className="cancelbtn" onClick={() => navigate(-1)}>Cancel</Button>
                            {!isViewMode && (
                                <Button
                                    type="submit"
                                    className="ms-2 save-btn"
                                    disabled={loading}
                                >
                                    {isEditMode ? "Update" : "Save"}
                                </Button>
                            )}

                        </div>

                    </Form>
                </Card.Body>
            </Card>

            <ImportModal show={showImportModal} onHide={() => setShowImportModal(false)} requisitionId={requisitionId} onSuccess={() => fetchPositions(requisitionId)} // optional but correct
            />
            <EducationModal key={`${eduMode}-${showEduModal}`} show={showEduModal} mode={eduMode} initialData={educationData[eduMode]} educationTypes={educationTypes} qualifications={qualifications} specializations={specializations} certifications={certifications} onHide={() => setShowEduModal(false)} onSave={({ educations, certificationIds, text }) => { setEducationData(prev => ({ ...prev, [eduMode]: { educations, certificationIds, text } })); setErrors(prev => { const upd = { ...prev }; delete upd[`${eduMode}Education`]; return upd; }); }} />
            <ConfirmUsePositionModal show={showConfirmModal} fields={POSITION_POPULATED_FIELDS} onYes={handleUsePositionData} onNo={() => { setPendingPosition(null); setShowConfirmModal(false); }} />
        </Container>
    );
};

export default AddPosition;