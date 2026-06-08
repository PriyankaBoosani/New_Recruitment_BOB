import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import "../../../style/css/CreateRequisition.css";
import ErrorMessage from "../../../shared/components/ErrorMessage";
import {
  validateRequisitionForm,
  validateTitleOnType,
  normalizeTitle,
} from "../validations/requisition-validation";
import { mapRequisitionToApi } from "../mappers/createRequisitionMapper";
import { useCreateRequisition } from "../hooks/useCreateRequisition";
import { REQUISITION_CONFIG } from "../config/requisitionConfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useJobPositionsByRequisition } from "../hooks/useJobPositionsByRequisition";
import masterApiService from "../../master/services/masterApiService";
import requisitionApiService from "../services/requisitionApiService";
import jobPositionApiService from "../services/jobPositionApiService";

const CreateRequisition = () => {
  const { t } = useTranslation(["CreateRequisition", "common"]);
  const renderError = (err) => (err ? t(err) : "");

  const { positionsByReq, fetchPositions, loadingReqId } =
    useJobPositionsByRequisition();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  /* ===================== URL + MODE ===================== */
  const query = new URLSearchParams(location.search);
  const editId = query.get("id"); //  DEFINE FIRST
  const mode = location.state?.mode; // "view" | "edit" | undefined

  const isViewMode = !!editId && mode === "view";
  const isCloneMode = mode === "clone";
  const isReinitializeMode = mode === "reinitialize";
  const isDraftView = location.state?.isDraftView;
  const isDraftEdit = location.state?.isDraftEdit;
  const isDraftMode = isDraftView || isDraftEdit;
  const parentRequisitionId = location.state?.parentRequisitionId;

  const handleCancel = () => {
    if (from === "approval") {
      navigate("/requisition-requests");
    } else {
      navigate("/job-posting");
    }
  };

  /* ===================== HOOK ===================== */
  const {
    formData,
    handleInputChange,
    saveRequisition,
    loading,
    fetching,
    error: apiError,
    requisitionData,
  } = useCreateRequisition(editId, mode, isDraftMode);

  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!editId) return;

    fetchPositions(editId, isDraftView);
  }, [editId, isDraftView]);

  const key = `${editId}_false`;
  const positions = positionsByReq[key] || [];

  const [selectedPositions, setSelectedPositions] = useState(new Set());
  const [draftSelectedPositionIds, setDraftSelectedPositionIds] = useState(
    new Set()
  );
  const [masterPositionsMap, setMasterPositionsMap] = useState({});

  useEffect(() => {
    const fetchMasterPositions = async () => {
      const res = await masterApiService.getMasterDisplayAll();

      const list = res?.data?.masterPositions || [];

      // 🔥 Convert to map for O(1) lookup
      const map = {};
      list.forEach((p) => {
        map[p.masterPositionsId] = p.positionName;
      });

      setMasterPositionsMap(map);
    };

    fetchMasterPositions();
  }, []);

  useEffect(() => {
    const loadDraftSelections = async () => {
      if (!isDraftEdit || !parentRequisitionId) return;

      try {
        const res =
          await jobPositionApiService.getDraftPositionsByRequisition(
            parentRequisitionId
          );

        const draftPositions = res?.data || [];

        setDraftSelectedPositionIds(
          new Set(draftPositions.map((p) => p.masterPositionId))
        );
      } catch (err) {
        console.error("Failed to load draft positions", err);
      }
    };

    loadDraftSelections();
  }, [isDraftEdit, parentRequisitionId]);

  const handleSave = async (e) => {
    e?.preventDefault?.();

    const { valid, errors: valErrors } = validateRequisitionForm(
      formData,
      { isCloneMode, isReinitializeMode },
      selectedPositions
    );

    if (!valid) {
      setErrors(valErrors);
      return;
    }

    if (isViewMode) return;

    try {
      // 🔵 CLONE MODE (existing)
      if (isCloneMode) {
        const positionIds = Array.from(selectedPositions);

        // EXISTING DRAFT UPDATE
        if (isDraftEdit) {
          await requisitionApiService.editDraftRequisition(
            parentRequisitionId,
            positionIds
          );

          const draftPayload = {
            requisitionDescription: formData.description,
            endDate: formData.endDate,
            cutoffDate: formData.cutoffDate,
          };

          await requisitionApiService.saveDraftDetails(
            parentRequisitionId,
            draftPayload
          );

          toast.success("Draft updated successfully");
        }

        // NEW DRAFT CREATION
        else {
          await requisitionApiService.editDraftRequisition(editId, positionIds);

          const draftPayload = {
            requisitionDescription: formData.description,
            endDate: formData.endDate,
            cutoffDate: formData.cutoffDate,
          };

          await requisitionApiService.saveDraftDetails(editId, draftPayload);

          toast.success("Draft created successfully");
        }
      }

      // 🟢 REINITIALIZE MODE (NEW API)
      else if (isReinitializeMode) {
        const payload = {
          parentRequisitionId: editId,
          positionIds: Array.from(selectedPositions),
          requisitionTitle: formData.title,
          requisitionDescription: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          cutoffDate: formData.cutoffDate,
        };

        await requisitionApiService.reinitializeRequisition(payload);

        toast.success("Reinitialized successfully");
      }

      // ⚪ NORMAL CREATE / EDIT
      else {
        const payload = mapRequisitionToApi(formData);
        await saveRequisition(payload);

        toast.success(editId ? t("update_success") : t("create_success"));
      }

      navigate(REQUISITION_CONFIG.SUCCESS_REDIRECT);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  useEffect(() => {
    if (
      !isDraftEdit ||
      positions.length === 0 ||
      draftSelectedPositionIds.size === 0
    )
      return;

    const selected = positions
      .filter((p) => draftSelectedPositionIds.has(p.masterPositionId))
      .map((p) => p.positionId);

    setSelectedPositions(new Set(selected));
  }, [isDraftEdit, positions, draftSelectedPositionIds]);

  function getTomorrowISO() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }

  /* ===================== LOADER ===================== */
  if (fetching) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>{t("loading")}</p>
      </Container>
    );
  }

  /* ===================== UI ===================== */
  return (
    <Container fluid className="create-requisition-page">
      <Card className="requisition-card">
        <Card.Body>
          <div className="section-title">
            <span className="indicator" />
           
            <h6>
              {isViewMode && t("view_requisition")}

              {!isViewMode && isReinitializeMode && (
                <>
                  {t("reinitialize_requisition")}{" "}
                  {requisitionData?.requisitionCode &&
                    ` (${requisitionData?.requisitionCode}`}{" "}
                  {requisitionData?.requisitionTitle &&
                    `- ${requisitionData?.requisitionTitle})`}
                </>
              )}

              {!isViewMode &&
                !isReinitializeMode &&
                editId &&
                t("edit_requisition")}

              {!editId && t("create_requisition")}
            </h6>
          </div>

          <Form onSubmit={handleSave}>
            {/*  THIS WAS MISSING */}
            <fieldset disabled={isViewMode}>
              <Form.Group className="mb-3 mt-3">
                <Form.Label>
                  {t("requisition_title")}{" "}
                  <span className="text-danger">*</span>
                </Form.Label>

                <Form.Control
                  name="title"
                  value={formData.title}
                  maxLength={200}
                  disabled={isCloneMode}
                  placeholder={t("enter_requisition_title")}
                  onChange={(e) => {
                    const result = validateTitleOnType(e.target.value);

                    if (!result.valid) {
                      setErrors((prev) => ({
                        ...prev,
                        title: result.message,
                      }));
                      return;
                    }

                    handleInputChange({
                      target: {
                        name: "title",
                        value: result.value,
                      },
                    });

                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.title;
                      return copy;
                    });
                  }}
                  onBlur={(e) =>
                    handleInputChange({
                      target: {
                        name: "title",
                        value: normalizeTitle(e.target.value).trim(),
                      },
                    })
                  }
                />

                <Form.Text className="text-muted">{t("title_help")}</Form.Text>
                <ErrorMessage>{renderError(errors.title)}</ErrorMessage>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      {t("description")} <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={6}
                      maxLength={2000}
                      name="description"
                      placeholder={t("enter_description")}
                      value={formData.description}
                      onChange={(e) => {
                        handleInputChange(e);
                        setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                      onBlur={(e) =>
                        handleInputChange({
                          target: {
                            name: "description",
                            value: e.target.value.trim(),
                          },
                        })
                      }
                    />
                    <ErrorMessage>
                      {renderError(errors.description)}
                    </ErrorMessage>
                  </Form.Group>

                  {(isCloneMode || isReinitializeMode) && (
                    <div className="mt-4">
                      <Form.Label>{t("select_positions_to_edit")}</Form.Label>

                      {loadingReqId === editId && <Spinner size="sm" />}

                      {!loadingReqId && positions.length === 0 && (
                        <div className="text-muted">No positions available</div>
                      )}

                      {!loadingReqId &&
                        positions.map((pos) => (
                          <Form.Check
                            key={pos.positionId}
                            type="checkbox"
                            className="mb-2"
                            style={{ fontSize: "0.875rem" }}
                            label={`${masterPositionsMap[pos.masterPositionId] || "Unknown"} - (${pos.vacancies} vacancies)`}
                            checked={selectedPositions.has(pos.positionId)}
                            onChange={(e) => {
                              setSelectedPositions((prev) => {
                                const next = new Set(prev);

                                if (e.target.checked) {
                                  next.add(pos.positionId);
                                } else {
                                  next.delete(pos.positionId);
                                }

                                return next;
                              });
                            }}
                          />
                        ))}
                    </div>
                  )}
                </Col>

                <Col md={6}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("start_date")}{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          disabled={isCloneMode}
                          min={getTomorrowISO()} // ✅ tomorrow onwards
                          onChange={(e) => {
                            const startDate = e.target.value;

                            handleInputChange({
                              target: {
                                name: "startDate",
                                value: startDate,
                              },
                            });

                            setErrors((prev) => ({
                              ...prev,
                              startDate: "",
                              endDate: "",
                            }));
                          }}
                        />
                        <Form.Text className="text-muted">
                          {t("start_date_help")}
                        </Form.Text>
                        <ErrorMessage>
                          {renderError(errors.startDate)}
                        </ErrorMessage>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {t("end_date")} <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={(e) => {
                            handleInputChange(e);
                            setErrors((prev) => ({ ...prev, endDate: "" }));
                          }}
                          min={formData.startDate}
                        />
                        <Form.Text className="text-muted">
                          {t("end_date_help")}
                        </Form.Text>
                        <ErrorMessage>
                          {renderError(errors.endDate)}
                        </ErrorMessage>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>
                          {t("cut_off_date")}{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                          type="date"
                          name="cutoffDate"
                          value={formData.cutoffDate}
                          onChange={(e) => {
                            handleInputChange(e);
                            setErrors((prev) => ({ ...prev, cutoffDate: "" }));
                          }}
                        />

                        <ErrorMessage>
                          {renderError(errors.cutoffDate)}
                        </ErrorMessage>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {apiError && (
                <div className="mt-3">
                  <ErrorMessage>{apiError}</ErrorMessage>
                </div>
              )}
            </fieldset>
          </Form>
        </Card.Body>
      </Card>

      <div className="footer-actions">
        <Button variant="outline-secondary" onClick={handleCancel}>
          {t("common:cancel")}
        </Button>

        {!isViewMode && (
          <Button onClick={handleSave} disabled={loading}>
            {editId ? t("common:update") : t("common:save")}
          </Button>
        )}
      </div>
    </Container>
  );
};

export default CreateRequisition;
