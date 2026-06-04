import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import masterApiService from "../../master/services/masterApiService";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
import { toast } from "react-toastify";
import candidateWorkflowServices from "../../candidatePreview/services/CandidateWorkflowServices";
import committeeManagementService from "../../committeeManagement/services/committeeManagementService";
import "../../../style/css/ExaminationCutoffConfiguration.css";
import { useSelector } from "react-redux";

export default function AddExaminationCutoffModal({
  show,
  onHide,
  onSuccess,
  editData = null,
  viewOnly = false,
  showApprovalActions = false,
  refreshExamConfigs,
  selectedRequisition,
  selectedPosition,
  fromCandidateScreening,
}) {
  /* ================= STATES ================= */

  const [loading, setLoading] = useState(false);

  const privileges = useSelector((state) => state.user.privileges);

  const isL1 = privileges?.["L1 Approval"];
  const isL2 = privileges?.["L2 Approval"];

  const [allCategories, setAllCategories] = useState([]);

  const [masterData, setMasterData] = useState({});

  const [expandedSection, setExpandedSection] = useState(0);

  const getStateName = (stateId) => {
    const states = masterData?.states || [];

    const matched = states.find(
      (item) =>
        String(item.stateId).toLowerCase() === String(stateId).toLowerCase()
    );

    return matched?.stateName || "-";
  };
  const [formData, setFormData] = useState({
    totalMarks: "",
    numberOfSections: "",

    sections: [],

    writtenExamWeightage: "",

    selectedWeightageSections: [],
  });

  const [decisionComments, setDecisionComments] = useState("");
  const [commentError, setCommentError] = useState("");

  const validateComments = () => {
    if (!decisionComments.trim()) {
      setCommentError("Comments are required");
      return false;
    }
    setCommentError("");
    return true;
  };

  const [positionDetails, setPositionDetails] = useState(null);

  const [reservationCategories, setReservationCategories] = useState([]);

  const [stateWiseDistributions, setStateWiseDistributions] = useState([]);

  const [isStateWisePosition, setIsStateWisePosition] = useState(false);

  const handleApprove = async () => {
    if (!validateComments()) return;

    try {
      setLoading(true);

      await committeeManagementService.approveOrRejectExamConfig({
        examConfigId: editData?.examConfigId,
        approved: true,
        comments: decisionComments.trim(),
      });

      toast.success("Configuration approved successfully");

      await refreshExamConfigs?.();

      onHide?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to approve configuration"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!validateComments()) return;

    try {
      setLoading(true);

      await committeeManagementService.approveOrRejectExamConfig({
        examConfigId: editData?.examConfigId,
        approved: false,
        comments: decisionComments.trim(),
      });

      toast.success("Configuration rejected successfully");

      await refreshExamConfigs?.();

      onHide?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to reject configuration"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT MODE ================= */

  const navigate = useNavigate();

  useEffect(() => {
    if (editData) {
      setFormData({
        totalMarks: editData.totalMarks || "",

        numberOfSections: editData.sections?.length || "",

        sections:
          editData.sections?.map((section) => {
            return {
              /* SAVE IDS IN FORM STATE */

              examConfigId: section.examConfigId || "",

              examSectionId: section.examSectionId || "",

              categoryPassMarks: section.categoryPassMarks || [],

              ...section,

              nationalCutoffs:
                section.categoryPassMarks?.reduce((acc, item) => {
                  acc[item.categoryId] = item.passMark;

                  return acc;
                }, {}) || {},

              stateCutoffs:
                section.categoryPassMarks?.reduce((acc, item) => {
                  if (item.stateId) {
                    if (!acc[item.stateId]) {
                      acc[item.stateId] = {};
                    }

                    acc[item.stateId][item.categoryId] = item.passMark;
                  }

                  return acc;
                }, {}) || {},
            };
          }) || [],

        writtenExamWeightage: editData.writtenExamWeightage || "",

        selectedWeightageSections:
          editData.sections
            ?.map((section, index) => (section.isRankingEnabled ? index : null))
            .filter((item) => item !== null) || [],
      });
    } else {
      resetForm();
    }
  }, [editData, show]);

  useEffect(() => {
    setDecisionComments("");
    setCommentError("");
  }, [editData?.examConfigId]);

  const fetchReservationCategories = async () => {
    try {
      const response = await masterApiService.getAllCategories();

      const categories = response?.data || [];

      const masterResponse = await masterApiService.getMasterDisplayAll();

      setMasterData(masterResponse?.data || {});

      setAllCategories(categories);

      setReservationCategories(categories);
    } catch (error) {
      console.error("Failed to fetch reservation categories", error);
    }
  };

  useEffect(() => {
    const fetchPositionDetails = async () => {
      try {
        if (!selectedPosition?.length) return;

        const positionId = selectedPosition?.[0]?.positionId;

        const res =
          await candidateWorkflowServices.getJobPositionById(positionId);

        const data = res?.data;

        setPositionDetails(data);

        /* ================= CHECK STATE WISE ================= */

        const distributions = data?.positionStateDistributions || [];

        const verticalCategories = allCategories.filter(
          (item) => item.reservationType === "VERTICAL"
        );

        const horizontalCategories = allCategories.filter(
          (item) => item.reservationType === "HORIZONTAL"
        );

        setReservationCategories([
          ...verticalCategories,
          ...horizontalCategories,
        ]);

        setStateWiseDistributions(distributions);

        setIsStateWisePosition(distributions.length > 0);
      } catch (err) {
        console.error("Failed to fetch position details", err);
      }
    };

    fetchPositionDetails();
  }, [selectedPosition, allCategories]);

  useEffect(() => {
    fetchReservationCategories();
  }, []);

  /* ================= RESET ================= */

  const resetForm = () => {
    setFormData({
      totalMarks: "",
      numberOfSections: "",

      sections: [],

      writtenExamWeightage: "",

      selectedWeightageSections: [],
    });
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleCloseAndBack = () => {
    //   resetForm();

    /* FROM CANDIDATE SCREENING */

    if (fromCandidateScreening) {
      navigate("/candidate-workflow", {
        replace: true,

        state: {
          requisitionId: selectedRequisition?.id,

          positionIds: selectedPosition?.map((item) => item.positionId),

          openExaminationScore: true,
        },
      });

      return;
    }

    onHide();
  };

  const handleSectionTotalMarksChange = (index, value) => {
    const enteredValue = Number(value || 0);

    const updatedSections = [...formData.sections];

    /* SINGLE SECTION SHOULD NOT
       EXCEED TOTAL MARKS */

    if (enteredValue > Number(formData.totalMarks)) {
      toast.warning(
        `Section marks cannot exceed Total Marks (${formData.totalMarks})`
      );
      updatedSections[index] = {
        ...updatedSections[index],
        sectionTotalMarks: "",
      };

      setFormData((prev) => ({
        ...prev,
        sections: updatedSections,
      }));

      return;
    }

    updatedSections[index] = {
      ...updatedSections[index],
      sectionTotalMarks: value,
    };

    /* TOTAL OF ALL SECTION MARKS */

    const totalSectionMarks = updatedSections.reduce(
      (sum, item) => sum + Number(item.sectionTotalMarks || 0),
      0
    );

    if (totalSectionMarks > Number(formData.totalMarks)) {
      toast.warning(
        `Sum of all section marks cannot exceed Total Marks (${formData.totalMarks})`
      );

      updatedSections[index] = {
        ...updatedSections[index],
        sectionTotalMarks: "",
      };

      setFormData((prev) => ({
        ...prev,
        sections: updatedSections,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      sections: updatedSections,
    }));
  };

  /* ================= GENERATE SECTIONS ================= */

  const handleGenerateSections = () => {
    const count = Number(formData.numberOfSections);

    if (!count || count <= 0) return;

    const existingSections = [...formData.sections];

    /* ADD NEW ROWS */

    if (existingSections.length < count) {
      const additionalSections = Array.from(
        {
          length: count - existingSections.length,
        },
        () => ({
          sectionName: "",
          sectionTotalMarks: "",
          nationalCutoffs: {},
          stateCutoffs: {},
          categoryPassMarks: [],
          examSectionId: "",
          examConfigId: "",
        })
      );

      setFormData((prev) => ({
        ...prev,

        sections: [...existingSections, ...additionalSections],
      }));

      return;
    }

    /* REMOVE EXTRA ROWS */

    if (existingSections.length > count) {
      setFormData((prev) => ({
        ...prev,

        sections: existingSections.slice(0, count),
      }));

      return;
    }
  };

  /* ================= SECTION CHANGE ================= */

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.sections];

    updatedSections[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      sections: updatedSections,
    }));
  };

  /* ================= WEIGHTAGE CHECKBOX ================= */

  const handleWeightageCheckbox = (sectionIndex) => {
    const existing = formData.selectedWeightageSections;

    const alreadySelected = existing.includes(sectionIndex);

    let updated = [];

    /* REMOVE IF ALREADY SELECTED */

    if (alreadySelected) {
      updated = existing.filter((item) => item !== sectionIndex);
    } else {
      updated = [...existing, sectionIndex];
    }

    setFormData((prev) => ({
      ...prev,
      selectedWeightageSections: updated,
    }));
  };
  const handleSave = async () => {
    try {
      setLoading(true);

      /* ================= CATEGORY IDS ================= */

      if (formData.sections.length !== Number(formData.numberOfSections)) {
        toast.error(
          `You selected ${formData.numberOfSections} sections but only ${formData.sections.length} sections are added. Please click + Add again.`
        );

        return;
      }

      /* ================= REQUIRED VALIDATIONS ================= */

      /* TOTAL MARKS */

      if (!formData.totalMarks || Number(formData.totalMarks) <= 0) {
        toast.error("Total Marks is required");

        return;
      }

      /* NUMBER OF SECTIONS */

      if (
        !formData.numberOfSections ||
        Number(formData.numberOfSections) <= 0
      ) {
        toast.error("Number of Sections is required");

        return;
      }

      /* SECTION COUNT */

      if (formData.sections.length !== Number(formData.numberOfSections)) {
        alert(
          `You selected ${formData.numberOfSections} sections but only ${formData.sections.length} sections are added. Please click + Add again.`
        );

        return;
      }

      /* SECTION VALIDATIONS */

      for (let i = 0; i < formData.sections.length; i++) {
        const section = formData.sections[i];

        /* SECTION NAME */

        if (!section.sectionName) {
          toast.error(`Section ${i + 1} name is required`);

          return;
        }

        /* SECTION TOTAL MARKS */

        if (
          !section.sectionTotalMarks ||
          Number(section.sectionTotalMarks) <= 0
        ) {
          toast.error(`Total Section Marks is required for Section ${i + 1}`);

          return;
        }

        /* SC/ST */
      }

      /* TOTAL SECTION MARKS
         SHOULD MATCH TOTAL MARKS */

      const totalSectionMarks = formData.sections.reduce(
        (sum, section) => sum + Number(section.sectionTotalMarks || 0),
        0
      );

      if (totalSectionMarks !== Number(formData.totalMarks)) {
        toast.error(
          `Sum of all Total Section Marks (${totalSectionMarks}) must equal Total Marks (${formData.totalMarks})`
        );

        return;
      }

      /* WRITTEN EXAM WEIGHTAGE */

      if (
        !formData.writtenExamWeightage ||
        Number(formData.writtenExamWeightage) <= 0
      ) {
        toast.error("Written Exam Weightage is required");

        return;
      }

      /* ONLY 2 WEIGHTAGE SECTIONS */

      if (formData.selectedWeightageSections.length === 0) {
        toast.error(
          "Please select at least one Weightage Configuration section"
        );

        return;
      }

      const sectionsPayload = formData.sections.map((section, index) => ({
        examConfigId: section.examConfigId || "",

        sectionNumber: index + 1,

        sectionName: section.sectionName,

        isRankingEnabled: formData.selectedWeightageSections.includes(index),

        sectionTotalMarks: Number(section.sectionTotalMarks || 0),

        isStatewise: isStateWisePosition,

        categoryPassMarks: isStateWisePosition
          ? stateWiseDistributions.flatMap((stateItem) =>
              reservationCategories.map((cat) => ({
                examSectionId: section.examSectionId || "",

                categoryId: cat.reservationCategoriesId,

                passMark: Number(
                  section?.stateCutoffs?.[stateItem.stateId]?.[
                    cat.reservationCategoriesId
                  ] || 0
                ),

                stateId: stateItem.stateId,

                examSectionCategoryId:
                  section.categoryPassMarks?.find(
                    (item) =>
                      item.categoryId === cat.reservationCategoriesId &&
                      item.stateId === stateItem.stateId
                  )?.examSectionCategoryId || "",
              }))
            )
          : reservationCategories.map((cat) => ({
              examSectionId: section.examSectionId || "",

              categoryId: cat.reservationCategoriesId,

              passMark: Number(
                section?.nationalCutoffs?.[cat.reservationCategoriesId] || 0
              ),

              stateId: null,

              examSectionCategoryId:
                section.categoryPassMarks?.find(
                  (item) => item.categoryId === cat.reservationCategoriesId
                )?.examSectionCategoryId || "",
            })),

        examSectionId: section.examSectionId || "",
      }));

      /* ================= PAYLOAD ================= */

      const payload = {
        positionIds: selectedPosition.map((item) => item.positionId),

        config: {
          positionId: selectedPosition?.[0]?.positionId,

          examName: "Written Examination",

          totalMarks: Number(formData.totalMarks),

          numberOfSections: Number(formData.numberOfSections),

          marksPerSection: Number(formData.marksPerSection || 0),

          writtenExamWeightage: Number(formData.writtenExamWeightage),

          interviewWeightage: 100 - Number(formData.writtenExamWeightage),

          status: "",

          comments: "",

          sections: sectionsPayload,
        },
      };

      console.log("SAVE PAYLOAD", payload);

      const response = await jobPositionApiService.saveConfiguration(payload);

      console.log("SAVE RESPONSE", response);

      /* SUCCESS */

      if (response?.success === true) {
        toast.success(
          response?.message || "Configuration submitted successfully"
        );

        onSuccess?.();

        resetForm();
        if (fromCandidateScreening) {
          navigate("/candidate-workflow", {
            replace: true,

            state: {
              requisitionId: selectedRequisition?.id,

              positionIds: selectedPosition?.map((item) => item.positionId),

              openExaminationScore: true,
              reopenKey: Date.now(),
            },
          });
        }
      } else {
        /* API FAILURE */

        toast.error(response?.message || "Failed to submit configuration");
      }
    } catch (err) {
      console.error("Failed to save configuration", err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = (editData?.status || "").trim().toUpperCase();

  const canTakeAction = (() => {
    if (isL1) {
      return currentStatus === "L1_PENDING";
    }

    if (isL2) {
      return currentStatus === "L2_PENDING";
    }

    return false;
  })();
  const validateCutoffValue = (value) => {
    if (value === "") return "";

    let cleanedValue = value.replace(/[^0-9]/g, "");

    const numericValue = Number(cleanedValue);

    if (numericValue < 0) {
      return "";
    }

    if (numericValue > 100) {
      toast.warning("Cutoff % cannot exceed 100");

      return "";
    }

    return cleanedValue;
  };

  const preventInvalidNumberInput = (e) => {
    if (
      e.key === "-" ||
      e.key === "+" ||
      e.key === "e" ||
      e.key === "E" ||
      e.key === "."
    ) {
      e.preventDefault();
    }
  };
  return (
    <Modal
      show={show}
      onHide={handleCloseAndBack}
      centered
      size="xl"
      backdrop="static"
      className="cutoff-config-modal"
    >
      <Modal.Header closeButton className="exammodal">
        <div>
          <h4 className="modal-main-title bluecol fs-15">
            {viewOnly
              ? "View Cut-off Configuration"
              : editData
                ? "Edit Cut-off Configuration"
                : "Add Cut-off Configuration"}
          </h4>

          <p className="modal-subtitle">
            Set and manage cut-off rules for streamlined workflow execution
          </p>
        </div>
      </Modal.Header>
      <Modal.Body className="exammodalbody">
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Total Marks
                <span className="required-star">*</span>
              </Form.Label>

              <Form.Control
                type="number"
                min={0}
                disabled={viewOnly}
                onKeyDown={preventInvalidNumberInput}
                placeholder="Sum of all sections combined."
                value={formData.totalMarks}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (value < 0) return;

                  handleChange("totalMarks", e.target.value);
                }}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Number of Sections
                <span className="required-star">*</span>
              </Form.Label>

              <Form.Control
                type="number"
                min={0}
                disabled={viewOnly}
                onKeyDown={preventInvalidNumberInput}
                placeholder="e.g. 4"
                value={formData.numberOfSections}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (value < 0) return;

                  // LIMIT TO 5
                  if (value > 5) {
                    toast.warning("Maximum 5 sections allowed");

                    return;
                  }

                  handleChange("numberOfSections", e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          {!showApprovalActions && (
            <Col md={4} className="d-flex align-items-end">
              <Button
                className="generate-btn"
                onClick={handleGenerateSections}
                disabled={
                  viewOnly || !formData.totalMarks || !formData.numberOfSections
                }
              >
                + Add
              </Button>
            </Col>
          )}
        </Row>
        <div className="cutoff-accordion-wrapper">
          {formData.sections.map((section, index) => {
            const isExpanded = expandedSection === index;

            return (
              <div key={index} className="cutoff-section-card">
                {/* HEADER */}

                <div
                  className="cutoff-section-header"
                  onClick={() => setExpandedSection(isExpanded ? null : index)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="section-header-content">
                      {/* SECTION NAME */}

                      <Form.Control
                        className="section-name-header-input"
                        placeholder={`Section ${index + 1}`}
                        value={section.sectionName || ""}
                        disabled={viewOnly}
                        onChange={(e) =>
                          handleSectionChange(
                            index,
                            "sectionName",
                            e.target.value
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* TOTAL MARKS */}

                      <div className="section-marks-wrapper">
                        <span className="marks-label">Total Section Marks</span>

                        <Form.Control
                          type="number"
                          className="section-marks-header-input"
                          placeholder="0"
                          disabled={viewOnly}
                          onKeyDown={preventInvalidNumberInput}
                          value={section.sectionTotalMarks || ""}
                          onChange={(e) =>
                            handleSectionTotalMarksChange(index, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* TITLE AT LAST */}

                      <div className="cutoff-title-wrapper">
                        <span className="cutoff-header-title">
                          {isStateWisePosition
                            ? "State Wise Cutoff Configuration"
                            : "National Wise Cutoff Configuration"}
                        </span>

                        <i
                          className={`bi bi-chevron-${
                            isExpanded ? "up" : "down"
                          } section-arrow-icon`}
                        />
                      </div>
                    </div>

                    {/* <span
              className={`ranking-badge ${
                formData.selectedWeightageSections.includes(index)
                  ? "enabled"
                  : "disabled"
              }`}
            >
              Ranking:
              {formData.selectedWeightageSections.includes(index)
                ? "Enabled"
                : "Disabled"}
            </span> */}
                  </div>
                </div>

                {/* BODY */}

                {isExpanded && (
                  <div className="cutoff-section-body">
                    <div className="section-table-only-layout">
                      {/* LEFT PANEL */}

                      {/* RIGHT PANEL */}

                      <div className="section-right-panel">
                        <div className="cutoff-table-wrapper">
                          {isStateWisePosition ? (
                            /* ================= STATE WISE ================= */

                            <table className="cutoff-state-table-modern">
                              <thead>
                                <tr>
                                  <th className="sticky-state-col">State</th>

                                  {reservationCategories.map((cat) => (
                                    <th key={cat.reservationCategoriesId}>
                                      {cat.categoryCode} Cutoff %
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                {stateWiseDistributions.map(
                                  (stateItem, stateIndex) => (
                                    <tr key={stateIndex}>
                                      <td className="sticky-state-col state-cell-modern">
                                        {getStateName(stateItem.stateId)}
                                      </td>

                                      {/* RESERVATION */}

                                      {reservationCategories.map((cat) => (
                                        <td key={cat.reservationCategoriesId}>
                                          <Form.Control
                                            type="number"
                                            min={0}
                                            max={100}
                                            disabled={viewOnly}
                                            onKeyDown={
                                              preventInvalidNumberInput
                                            }
                                            className="modern-cutoff-input"
                                            placeholder="0"
                                            value={
                                              formData.sections[index]
                                                ?.stateCutoffs?.[
                                                stateItem.stateId
                                              ]?.[
                                                cat.reservationCategoriesId
                                              ] ?? ""
                                            }
                                            onChange={(e) => {
                                              const value = validateCutoffValue(
                                                e.target.value
                                              );

                                              const updatedSections = [
                                                ...formData.sections,
                                              ];

                                              if (
                                                !updatedSections[index]
                                                  .stateCutoffs
                                              ) {
                                                updatedSections[
                                                  index
                                                ].stateCutoffs = {};
                                              }

                                              if (
                                                !updatedSections[index]
                                                  .stateCutoffs[
                                                  stateItem.stateId
                                                ]
                                              ) {
                                                updatedSections[
                                                  index
                                                ].stateCutoffs[
                                                  stateItem.stateId
                                                ] = {};
                                              }

                                              updatedSections[
                                                index
                                              ].stateCutoffs[stateItem.stateId][
                                                cat.reservationCategoriesId
                                              ] = value;

                                              setFormData((prev) => ({
                                                ...prev,
                                                sections: updatedSections,
                                              }));
                                            }}
                                          />
                                        </td>
                                      ))}

                                      {/* DISABILITY */}

                                      {/* DISABILITY */}
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          ) : (
                            /* ================= NATIONAL ================= */

                            /* ================= NATIONAL ================= */

                            <table className="cutoff-state-table-modern national-cutoff-table">
                              <thead>
                                <tr>
                                  {reservationCategories.map((cat) => (
                                    <th
                                      key={cat.reservationCategoriesId}
                                      className="text-center"
                                    >
                                      {cat.categoryCode} Cutoff %
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  {/* CATEGORY */}

                                  {reservationCategories.map((cat) => (
                                    <td key={cat.reservationCategoriesId}>
                                      <Form.Control
                                        type="number"
                                        min={0}
                                        max={100}
                                        disabled={viewOnly}
                                        className="modern-cutoff-input"
                                        onKeyDown={preventInvalidNumberInput}
                                        placeholder="0"
                                        value={
                                          formData.sections[index]
                                            ?.nationalCutoffs?.[
                                            cat.reservationCategoriesId
                                          ] ?? ""
                                        }
                                        onChange={(e) => {
                                          const value = validateCutoffValue(
                                            e.target.value
                                          );

                                          const updatedSections = [
                                            ...formData.sections,
                                          ];

                                          if (
                                            !updatedSections[index]
                                              .nationalCutoffs
                                          ) {
                                            updatedSections[
                                              index
                                            ].nationalCutoffs = {};
                                          }

                                          updatedSections[
                                            index
                                          ].nationalCutoffs[
                                            cat.reservationCategoriesId
                                          ] = value;

                                          console.log(
                                            "NATIONAL CUTOFFS",
                                            updatedSections[index]
                                              .nationalCutoffs
                                          );

                                          setFormData((prev) => ({
                                            ...prev,
                                            sections: updatedSections,
                                          }));
                                        }}
                                      />
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= CATEGORY WISE CUTOFF ================= */}

        {/*  */}

        {/* ================= WEIGHTAGE CONFIG ================= */}

        {formData.totalMarks &&
          formData.numberOfSections &&
          formData.sections.length > 0 && (
            <div className="weightage-box mt-4">
              <h5 className="section-title">
                Section consideration for combined score:
                {/* // Weightage Configuration */}
              </h5>

              <div className="weightage-chip-wrapper">
                {formData.sections.map((section, index) => (
                  <div
                    key={index}
                    className={`weightage-chip ${
                      formData.selectedWeightageSections.includes(index)
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      if (viewOnly) return;

                      handleWeightageCheckbox(index);
                    }}
                  >
                    <Form.Check
                      disabled={viewOnly}
                      type="checkbox"
                      checked={formData.selectedWeightageSections.includes(
                        index
                      )}
                      readOnly
                    />

                    <span>{section.sectionName || `Section ${index + 1}`}</span>
                  </div>
                ))}
              </div>

              <div className="weightage-input-wrapper">
                <Form.Group>
                  <Form.Label>
                    Written Exam Weightage (%)
                    <span className="required-star">*</span>
                  </Form.Label>

                  <Form.Control
                    min={0}
                    max={100}
                    type="number"
                    disabled={viewOnly}
                    onKeyDown={preventInvalidNumberInput}
                    placeholder="Enter %"
                    min={0}
                    max={100}
                    value={formData.writtenExamWeightage}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (value > 100) {
                        toast.warning(
                          "Written Exam Weightage cannot exceed 100%"
                        );

                        return;
                      }

                      handleChange("writtenExamWeightage", e.target.value);
                    }}
                  />
                </Form.Group>
              </div>
            </div>
          )}
      </Modal.Body>

      {/* ================= FOOTER ================= */}
      {showApprovalActions && (
        <div className="px-3 pb-3">
          <Form.Group>
            <Form.Label>
              Comments <span className="text-danger">*</span>
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter comments"
              value={decisionComments}
              disabled={!canTakeAction}
              onChange={(e) => {
                setDecisionComments(e.target.value);

                if (commentError) {
                  setCommentError("");
                }
              }}
              isInvalid={!!commentError}
            />
            <Form.Control.Feedback type="invalid">
              {commentError}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      )}

      <Modal.Footer className="border-0">
        {showApprovalActions ? (
          <>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={loading || !canTakeAction}
            >
              Reject
            </Button>

            <Button
              variant="success"
              onClick={handleApprove}
              disabled={loading || !canTakeAction}
            >
              Accept
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="light"
              className="cancel-btn"
              onClick={handleCloseAndBack}
            >
              Cancel
            </Button>

            {!viewOnly && (
              <Button
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            )}
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
