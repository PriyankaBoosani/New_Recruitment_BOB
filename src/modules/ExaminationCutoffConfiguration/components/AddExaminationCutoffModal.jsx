import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import masterApiService from "../../master/services/masterApiService";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
import { toast } from "react-toastify";


import ExaminationCutoffService from "../service/ExaminationCutoffService";
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
  fromCandidateScreening
}) {
  /* ================= STATES ================= */

  const [loading, setLoading] = useState(false);

  const privileges = useSelector(state => state.user.privileges);

  const isL1 = privileges?.["L1 Approval"];
  const isL2 = privileges?.["L2 Approval"];


  const [formData, setFormData] = useState({
    totalMarks: "",
    numberOfSections: "",

    sections: [],

    categoryWiseCutoff: {
      scst: "",
      obc: "",
      ur: ""
    },

    writtenExamWeightage: "",

    selectedWeightageSections: []
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
        error?.response?.data?.message ||
        "Failed to approve configuration"
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
        error?.response?.data?.message ||
        "Failed to reject configuration"
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

        numberOfSections:
          editData.sections?.length || "",

        sections:
          editData.sections?.map(
            section => {

              const scst =
                section.categoryPassMarks?.find(
                  item =>
                    item.categoryId ===
                    "69bf3f47-2cf9-4e0d-90a9-2e77a1752b6b"
                );

              const obc =
                section.categoryPassMarks?.find(
                  item =>
                    item.categoryId ===
                    "b5b949b3-3b1a-4f27-96a2-3e1e2390b72b"
                );

              const ur =
                section.categoryPassMarks?.find(
                  item =>
                    item.categoryId ===
                    "0a02efbd-11fe-498b-b8db-9bb76cae18a1"
                );


              const ews =
                section.categoryPassMarks?.find(
                  item =>
                    item.categoryId ===
                    "a56f2294-d032-4598-b994-44480da4fc2e"
                );

              //   return {

              //     ...section,

              //     passMarks: {

              //       scst:
              //         scst?.passMark || "",

              //       obc:
              //         obc?.passMark || "",

              //       ur:
              //         ur?.passMark || ""
              //     }
              //   };





              return {

                /* SAVE IDS IN FORM STATE */

                examConfigId:
                  section.examConfigId || "",

                examSectionId:
                  section.examSectionId || "",

                categoryPassMarks:
                  section.categoryPassMarks || [],

                ...section,

                passMarks: {

                  scst:
                    scst?.passMark || "",

                  obc:
                    obc?.passMark || "",

                  ews:
                    ews?.passMark || "",

                  ur:
                    ur?.passMark || ""
                }
              };
            }
          ) || [],

        categoryWiseCutoff: {
          scst: editData.scstCutoff || "",
          obc: editData.obcCutoff || "",
          ur: editData.urCutoff || ""
        },

        writtenExamWeightage:
          editData.writtenExamWeightage || "",

        selectedWeightageSections:
          editData.sections
            ?.map(
              (section, index) =>
                section.isRankingEnabled
                  ? index
                  : null
            )
            .filter(
              item => item !== null
            ) || []
      });
    } else {
      resetForm();
    }
  }, [editData, show]);


  const fetchReservationCategories =
    async () => {

      try {

        const response =
          await masterApiService.getMasterDisplayAll()

        const categories =
          response?.data
            ?.reservationCategories || [];

        const scCategory =
          categories.find(
            item =>
              item.categoryCode === "SC"
          );

        const obcCategory =
          categories.find(
            item =>
              item.categoryCode === "OBC"
          );

        const ewsCategory =
          categories.find(
            item =>
              item.categoryCode === "EWS"
          );


        const genCategory =
          categories.find(
            item =>
              item.categoryCode === "GEN"
          );

        setCategoryIds({
          scst:
            scCategory
              ?.reservationCategoriesId || "",

          obc:
            obcCategory
              ?.reservationCategoriesId || "",

          ews:
            ewsCategory
              ?.reservationCategoriesId || "",

          ur:
            genCategory
              ?.reservationCategoriesId || ""
        });

      } catch (error) {

        console.error(
          "Failed to fetch reservation categories",
          error
        );

      }
    };


  useEffect(() => {

    fetchReservationCategories();

  }, []);

  /* ================= RESET ================= */

  const resetForm = () => {
    setFormData({
      totalMarks: "",
      numberOfSections: "",

      sections: [],

      categoryWiseCutoff: {
        scst: "",
        obc: "",
        ur: ""
      },

      writtenExamWeightage: "",

      selectedWeightageSections: []
    });
  };

  /* ================= INPUT CHANGE ================= */

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /* ================= CATEGORY CHANGE ================= */

  const handleCategoryChange = (
    field,
    value
  ) => {
    setFormData(prev => ({
      ...prev,

      categoryWiseCutoff: {
        ...prev.categoryWiseCutoff,
        [field]: value
      }
    }));
  };








  const handleCloseAndBack = () => {

    //   resetForm();

    /* FROM CANDIDATE SCREENING */

    if (fromCandidateScreening) {

      navigate(
        "/candidate-workflow",
        {
          replace: true,

          state: {

            requisitionId:
              selectedRequisition?.id,

            positionIds:
              selectedPosition?.map(
                item => item.positionId
              ),

            openExaminationScore: true
          }
        }
      );

      return;
    }

    onHide();
  };




  const handlePassMarksChange = (
    index,
    category,
    value
  ) => {

    const enteredPercentage =
      Number(value || 0);

    const sectionTotalMarks =
      Number(
        formData.sections[index]
          ?.sectionTotalMarks || 0
      );

    const updatedSections = [
      ...formData.sections
    ];

    /* SHOULD NOT EXCEED 100 */

    if (enteredPercentage > 100) {

      alert(
        `${category.toUpperCase()} Cutoff Percentage cannot exceed 100%`
      );

      updatedSections[index].passMarks[
        category
      ] = "";

      setFormData(prev => ({
        ...prev,
        sections: updatedSections
      }));

      return;
    }

    /* SHOULD NOT EXCEED
       TOTAL SECTION MARKS */

    /* TOTAL CATEGORY MARKS
       SHOULD NOT EXCEED
       TOTAL SECTION MARKS */

    // const currentPassMarks = {
    //   ...updatedSections[index].passMarks,

    //   [category]: Number(value || 0)
    // };

    // const totalCategoryMarks =
    //   Number(currentPassMarks.scst || 0) +
    //   Number(currentPassMarks.obc || 0) +
    //   Number(currentPassMarks.ur || 0);

    // if (
    //   totalCategoryMarks >
    //   sectionTotalMarks
    // ) {

    //   alert(
    //     `Total cutoff marks cannot exceed Total Section Marks (${sectionTotalMarks})`
    //   );

    //   updatedSections[index].passMarks[
    //     category
    //   ] = "";

    //   setFormData(prev => ({
    //     ...prev,
    //     sections: updatedSections
    //   }));

    //   return;
    // }

    updatedSections[index].passMarks[
      category
    ] = value;

    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const [categoryIds, setCategoryIds] =
    useState({
      scst: "",
      obc: "",
      ews: "",
      ur: ""
    });

  const handleSectionTotalMarksChange = (
    index,
    value
  ) => {

    const enteredValue =
      Number(value || 0);

    const updatedSections = [
      ...formData.sections
    ];

    /* SINGLE SECTION SHOULD NOT
       EXCEED TOTAL MARKS */

    if (
      enteredValue >
      Number(formData.totalMarks)
    ) {

      alert(
        `Section marks cannot exceed Total Marks (${formData.totalMarks})`
      );

      updatedSections[index] = {
        ...updatedSections[index],
        sectionTotalMarks: ""
      };

      setFormData(prev => ({
        ...prev,
        sections: updatedSections
      }));

      return;
    }

    updatedSections[index] = {
      ...updatedSections[index],
      sectionTotalMarks: value
    };

    /* TOTAL OF ALL SECTION MARKS */

    const totalSectionMarks =
      updatedSections.reduce(
        (sum, item) =>
          sum +
          Number(
            item.sectionTotalMarks || 0
          ),
        0
      );

    if (
      totalSectionMarks >
      Number(formData.totalMarks)
    ) {

      alert(
        `Sum of all section marks cannot exceed Total Marks (${formData.totalMarks})`
      );

      updatedSections[index] = {
        ...updatedSections[index],
        sectionTotalMarks: ""
      };

      setFormData(prev => ({
        ...prev,
        sections: updatedSections
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  /* ================= GENERATE SECTIONS ================= */

  const handleGenerateSections = () => {

    const count = Number(
      formData.numberOfSections
    );

    if (!count || count <= 0)
      return;

    const existingSections =
      [...formData.sections];

    /* ADD NEW ROWS */

    if (
      existingSections.length < count
    ) {

      const additionalSections =
        Array.from(
          {
            length:
              count -
              existingSections.length
          },
          () => ({
            sectionName: "",

            sectionTotalMarks: "",

            passMarks: {
              scst: "",
              obc: "",
              ews: "",
              ur: ""
            }
          })
        );

      setFormData(prev => ({
        ...prev,

        sections: [
          ...existingSections,
          ...additionalSections
        ]
      }));

      return;
    }

    /* REMOVE EXTRA ROWS */

    if (
      existingSections.length > count
    ) {

      setFormData(prev => ({
        ...prev,

        sections:
          existingSections.slice(
            0,
            count
          )
      }));

      return;
    }

  };

  /* ================= SECTION CHANGE ================= */

  const handleSectionChange = (
    index,
    field,
    value
  ) => {
    const updatedSections = [
      ...formData.sections
    ];

    updatedSections[index][field] = value;

    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  /* ================= WEIGHTAGE CHECKBOX ================= */

  const handleWeightageCheckbox =
    sectionIndex => {

      const existing =
        formData.selectedWeightageSections;

      const alreadySelected =
        existing.includes(sectionIndex);

      let updated = [];

      /* REMOVE IF ALREADY SELECTED */

      if (alreadySelected) {

        updated = existing.filter(
          item => item !== sectionIndex
        );

      } else {

        /* ALLOW ONLY 2 SECTIONS */

        // if (existing.length >= 2) {

        //   alert(
        //     "Only 2 sections can be selected"
        //   );

        //   return;
        // }

        updated = [
          ...existing,
          sectionIndex
        ];
      }

      setFormData(prev => ({
        ...prev,
        selectedWeightageSections: updated
      }));
    };

  /* ================= SAVE ================= */




  const handleSave = async () => {
    try {
      setLoading(true);

      /* ================= CATEGORY IDS ================= */

      // Replace with actual master category ids from API
      // const CATEGORY_IDS = {
      //   scst: "SC/ST",
      //   obc: "OBC",
      //   ur: "UR"
      // };

      //     const CATEGORY_IDS = {
      //   scst:
      //     "3fa85f64-5717-4562-b3fc-2c963f66afa6",

      //   obc:
      //     "3fa85f64-5717-4562-b3fc-2c963f66afa7",

      //   ur:
      //     "3fa85f64-5717-4562-b3fc-2c963f66afa8"
      // };

      /* ================= SECTION PAYLOAD ================= */
      /* ================= SECTION COUNT VALIDATION ================= */

      if (
        formData.sections.length !==
        Number(formData.numberOfSections)
      ) {

        alert(
          `You selected ${formData.numberOfSections} sections but only ${formData.sections.length} sections are added. Please click + Add again.`
        );

        return;
      }



      /* ================= REQUIRED VALIDATIONS ================= */

      /* TOTAL MARKS */

      if (
        !formData.totalMarks ||
        Number(formData.totalMarks) <= 0
      ) {
        alert("Total Marks is required");

        return;
      }

      /* NUMBER OF SECTIONS */

      if (
        !formData.numberOfSections ||
        Number(
          formData.numberOfSections
        ) <= 0
      ) {

        alert(
          "Number of Sections is required"
        );

        return;
      }

      /* SECTION COUNT */

      if (
        formData.sections.length !==
        Number(formData.numberOfSections)
      ) {

        alert(
          `You selected ${formData.numberOfSections} sections but only ${formData.sections.length} sections are added. Please click + Add again.`
        );

        return;
      }

      /* SECTION VALIDATIONS */

      for (
        let i = 0;
        i < formData.sections.length;
        i++
      ) {

        const section =
          formData.sections[i];

        /* SECTION NAME */

        if (!section.sectionName) {

          alert(
            `Section ${i + 1} name is required`
          );

          return;
        }

        /* SECTION TOTAL MARKS */

        if (
          !section.sectionTotalMarks ||
          Number(
            section.sectionTotalMarks
          ) <= 0
        ) {

          alert(
            `Total Section Marks is required for Section ${i + 1}`
          );

          return;
        }

        /* SC/ST */

        if (
          section.passMarks?.scst === "" ||
          Number(
            section.passMarks?.scst
          ) <= 0
        ) {

          alert(
            `SC/ST Cutoff % is required for Section ${i + 1}`
          );

          return;
        }

        /* OBC */

        if (
          section.passMarks?.obc === "" ||
          Number(
            section.passMarks?.obc
          ) <= 0
        ) {

          alert(
            `OBC Cutoff % is required for Section ${i + 1}`
          );

          return;
        }

        if (
          section.passMarks?.ews === "" ||
          Number(
            section.passMarks?.ews
          ) <= 0
        ) {

          alert(
            `EWS Cutoff % is required for Section ${i + 1}`
          );

          return;
        }


        /* UR */

        if (
          section.passMarks?.ur === "" ||
          Number(
            section.passMarks?.ur
          ) <= 0
        ) {

          alert(
            `UR Cutoff % is required for Section ${i + 1}`
          );

          return;
        }
      }

      /* TOTAL SECTION MARKS
         SHOULD MATCH TOTAL MARKS */

      const totalSectionMarks =
        formData.sections.reduce(
          (sum, section) =>
            sum +
            Number(
              section.sectionTotalMarks || 0
            ),
          0
        );

      if (
        totalSectionMarks !==
        Number(formData.totalMarks)
      ) {

        alert(
          `Sum of all Total Section Marks (${totalSectionMarks}) must equal Total Marks (${formData.totalMarks})`
        );

        return;
      }

      /* WRITTEN EXAM WEIGHTAGE */

      if (
        !formData.writtenExamWeightage ||
        Number(
          formData.writtenExamWeightage
        ) <= 0
      ) {

        alert(
          "Written Exam Weightage is required"
        );

        return;
      }

      /* ONLY 2 WEIGHTAGE SECTIONS */

      if (
        formData.selectedWeightageSections
          .length === 0
      ) {

        alert(
          "Please select at least one Weightage Configuration section"
        );

        return;
      }



      const sectionsPayload =
        formData.sections.map(
          (section, index) => ({

            /* PRESERVE IDS FOR EDIT */

            examConfigId:
              section.examConfigId || "",

            examSectionId:
              section.examSectionId || "",

            sectionNumber:
              index + 1,

            sectionName:
              section.sectionName,

            isRankingEnabled:
              formData.selectedWeightageSections.includes(
                index
              ),

            sectionTotalMarks: Number(
              section.sectionTotalMarks || 0
            ),

            categoryPassMarks: [

              {
                examSectionId:
                  section.examSectionId || "",

                examSectionCategoryId:
                  section.categoryPassMarks?.find(
                    item =>
                      item.categoryId ===
                      categoryIds.scst
                  )?.examSectionCategoryId || "",

                categoryId:
                  categoryIds.scst,

                passMark: Number(
                  section.passMarks?.scst || 0
                )
              },

              {
                examSectionId:
                  section.examSectionId || "",

                examSectionCategoryId:
                  section.categoryPassMarks?.find(
                    item =>
                      item.categoryId ===
                      categoryIds.obc
                  )?.examSectionCategoryId || "",

                categoryId:
                  categoryIds.obc,

                passMark: Number(
                  section.passMarks?.obc || 0
                )
              },

              {
                examSectionId:
                  section.examSectionId || "",

                examSectionCategoryId:
                  section.categoryPassMarks?.find(
                    item =>
                      item.categoryId ===
                      categoryIds.ews
                  )?.examSectionCategoryId || "",

                categoryId:
                  categoryIds.ews,

                passMark: Number(
                  section.passMarks?.ews || 0
                )
              },

              {
                examSectionId:
                  section.examSectionId || "",

                examSectionCategoryId:
                  section.categoryPassMarks?.find(
                    item =>
                      item.categoryId ===
                      categoryIds.ur
                  )?.examSectionCategoryId || "",

                categoryId:
                  categoryIds.ur,

                passMark: Number(
                  section.passMarks?.ur || 0
                )
              }
            ]
          })
        );

      /* ================= PAYLOAD ================= */

      const payload = {
        positionIds:
          selectedPosition.map(
            item => item.positionId
          ),

        config: {


          positionId:
            selectedPosition?.[0]
              ?.positionId,

          examName:
            "Written Examination",

          totalMarks: Number(
            formData.totalMarks
          ),

          numberOfSections:
            Number(
              formData.numberOfSections
            ),

          marksPerSection:
            Number(
              formData.totalMarks
            ) /
            Number(
              formData.numberOfSections
            ),

          writtenExamWeightage:
            Number(
              formData.writtenExamWeightage
            ),

          interviewWeightage:
            100 -
            Number(
              formData.writtenExamWeightage
            ),

          status: "",

          comments: "",

          sections: sectionsPayload
        }
      };

      console.log(
        "SAVE PAYLOAD",
        payload
      );

      const response =
        await jobPositionApiService.saveConfiguration(
          payload
        );

      console.log(
        "SAVE RESPONSE",
        response
      );

      /* SUCCESS */

      if (response?.success === true) {

        toast.success(
          response?.message ||
          "Configuration submitted successfully"
        );

        onSuccess?.();

        resetForm();

        /* FROM CANDIDATE SCREENING */

        if (fromCandidateScreening) {

          navigate(
            "/candidate-workflow",
            {
              replace: true,

              state: {

                requisitionId:
                  selectedRequisition?.id,

                positionIds:
                  selectedPosition?.map(
                    item => item.positionId
                  ),

                openExaminationScore: true
              }
            }
          );
        }

      } else {

        /* API FAILURE */

        toast.error(
          response?.message ||
          "Failed to submit configuration"
        );
      }
      // navigate(
      //   "/candidate-workflow",
      //   {
      //     state: {
      //       requisitionId:
      //         selectedRequisition?.id,

      //       positionIds:
      //         selectedPosition?.map(
      //           item => item.positionId
      //         ),

      //       openExaminationScore: true
      //     }
      //   }
      // );

    } catch (err) {

      console.error(
        "Failed to save configuration",
        err
      );

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      alert(errorMessage);

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
      return currentStatus === "L1_APPROVED";
    }

    return false;

  })();

  /* ================= UI ================= */

  return (
    <Modal
      show={show}
      onHide={handleCloseAndBack}
      centered
      size="xl"
      backdrop="static"
      className="cutoff-config-modal"
    >
      {/* ================= HEADER ================= */}

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
            Set and manage cut-off rules for
            streamlined workflow execution
          </p>
        </div>
      </Modal.Header>

      {/* ================= BODY ================= */}

      <Modal.Body className="exammodalbody">
        {/* ================= TOP ROW ================= */}

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Total Marks
                <span className="required-star">
                  *
                </span>
              </Form.Label>

              <Form.Control
                type="number"
                min={0}
                disabled={viewOnly}
                placeholder="Sum of all sections combined."
                value={formData.totalMarks}
                onChange={e => {

                  const value =
                    Number(e.target.value);

                  if (value < 0) return;

                  handleChange(
                    "totalMarks",
                    e.target.value
                  );

                }}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Number of Sections
                <span className="required-star">
                  *
                </span>
              </Form.Label>

              <Form.Control
                type="number"
                min={0}
                disabled={viewOnly}
                placeholder="e.g. 4"
                value={
                  formData.numberOfSections
                }
                onChange={e => {

                  const value =
                    Number(e.target.value);

                  if (value < 0) return;

                  handleChange(
                    "numberOfSections",
                    e.target.value
                  );

                }}
              />
            </Form.Group>
          </Col>
          {!showApprovalActions && (
            <Col
              md={4}
              className="d-flex align-items-end"
            >
              <Button
                className="generate-btn"
                onClick={handleGenerateSections}
                disabled={
                  viewOnly ||
                  !formData.totalMarks ||
                  !formData.numberOfSections
                }
              >
                + Add
              </Button>
            </Col>
             )}
        </Row>
           
        {/* ================= DYNAMIC SECTIONS ================= */}

        <div className="sections-wrapper">
          <div className="section-table-wrapper">
            <table className="section-cutoff-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Total Section Marks</th>
                  <th>SC/ST Cutoff %</th>
                  <th>OBC Cutoff %</th>
                  <th>EWS Cutoff %</th>
                  <th>UR Cutoff %</th>
                </tr>
              </thead>

              <tbody>
                {formData.sections.map(
                  (section, index) => (
                    <tr key={index}>
                      {/* SECTION */}

                      <td>
                        <Form.Control
                          disabled={viewOnly}
                          placeholder={`Section ${index + 1
                            }`}
                          value={
                            section.sectionName
                          }
                          onChange={e =>
                            handleSectionChange(
                              index,
                              "sectionName",
                              e.target.value
                            )
                          }
                        />
                      </td>



                      {/* TOTAL SECTION MARKS */}

                      <td>
                        <Form.Control
                          disabled={viewOnly}
                          type="number"
                          min={0}
                          placeholder="Enter Marks"
                          value={
                            section.sectionTotalMarks || ""
                          }
                          onChange={e => {

                            const value =
                              Number(e.target.value);

                            if (value < 0) return;

                            handleSectionTotalMarksChange(
                              index,
                              e.target.value
                            );

                          }}
                        />

                      </td>


                      {/* SC/ST */}

                      <td>
                        <Form.Control
                          min={0}
                          max={100}
                          type="number"
                          disabled={viewOnly}
                          placeholder="Enter %"
                          value={
                            section.passMarks
                              ?.scst || ""
                          }
                          onChange={e =>
                            handlePassMarksChange(
                              index,
                              "scst",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      {/* OBC */}

                      <td>
                        <Form.Control
                          min={0}
                          max={100}
                          type="number"
                          disabled={viewOnly}
                          placeholder="Enter %"
                          value={
                            section.passMarks
                              ?.obc || ""
                          }
                          onChange={e =>
                            handlePassMarksChange(
                              index,
                              "obc",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          min={0}
                          max={100}
                          type="number"
                          disabled={viewOnly}
                          placeholder="Enter %"
                          value={
                            section.passMarks?.ews || ""
                          }
                          onChange={e =>
                            handlePassMarksChange(
                              index,
                              "ews",
                              e.target.value
                            )
                          }
                        />
                      </td>


                      {/* UR */}

                      <td>
                        <Form.Control
                          min={0}
                          max={100}
                          type="number"
                          disabled={viewOnly}
                          placeholder="Enter %"

                          value={
                            section.passMarks?.ur ||
                            ""
                          }
                          onChange={e =>
                            handlePassMarksChange(
                              index,
                              "ur",
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* ================= CATEGORY WISE CUTOFF ================= */}

        {/*  */}

        {/* ================= WEIGHTAGE CONFIG ================= */}

        <div className="weightage-box mt-4">
          <h5 className="section-title">
            Section consideration for comnined score:
            {/* // Weightage Configuration */}
          </h5>

          <div className="weightage-chip-wrapper">
            {formData.sections.map(
              (section, index) => (
                <div
                  key={index}
                  className={`weightage-chip ${formData.selectedWeightageSections.includes(
                    index
                  )
                    ? "active"
                    : ""
                    }`}
                  onClick={() => {

                    if (viewOnly) return;

                    handleWeightageCheckbox(
                      index
                    );

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

                  <span>
                    {section.sectionName ||
                      `Section ${index + 1
                      }`}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="weightage-input-wrapper">
            <Form.Group>
              <Form.Label>
                Written Exam Weightage (%)
                <span className="required-star">
                  *
                </span>
              </Form.Label>

              <Form.Control
                min={0}
                max={100}
                type="number"
                disabled={viewOnly}
                placeholder="Enter %"
                min={0}
                max={100}
                value={
                  formData.writtenExamWeightage
                }
                onChange={e => {

                  const value =
                    Number(e.target.value);

                  if (value > 100) {

                    alert(
                      "Written Exam Weightage cannot exceed 100%"
                    );

                    return;
                  }

                  handleChange(
                    "writtenExamWeightage",
                    e.target.value
                  );

                }}
              />
            </Form.Group>
          </div>
        </div>
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
            <Button variant="light" className="cancel-btn" onClick={handleCloseAndBack}>
              Cancel
            </Button>

            {!viewOnly && (
              <Button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            )}
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}