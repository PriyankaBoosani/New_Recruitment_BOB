import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../../../../../style/Experience.css";
import { useTranslation } from "react-i18next";
import deleteIcon from "../../../../../assets/delete_icon.png";

const ExperienceModal = ({
  show,
  handleCloseModal,
  formData,
  saveExperience,
  errors = [],
  onChange,
  onAddSpec,
  onRemoveSpec,
  isViewing,
  isEditing,
  educationOptions,
}) => {
  const { t } = useTranslation(["education", "common"]);

  const getDuplicateIndexes = (list = []) => {
    const nameMap = {};
    const codeMap = {};

    const duplicateNames = new Set();
    const duplicateCodes = new Set();

    list.forEach((val, index) => {
      /* NAME */
      const nameKey = val?.name?.trim().toLowerCase();

      if (nameKey) {
        if (nameMap[nameKey] !== undefined) {
          duplicateNames.add(index);
          duplicateNames.add(nameMap[nameKey]);
        } else {
          nameMap[nameKey] = index;
        }
      }

      /* CODE */
      const codeKey = val?.code?.trim().toLowerCase();

      if (codeKey) {
        if (codeMap[codeKey] !== undefined) {
          duplicateCodes.add(index);
          duplicateCodes.add(codeMap[codeKey]);
        } else {
          codeMap[codeKey] = index;
        }
      }
    });

    return {
      duplicateNames,
      duplicateCodes,
    };
  };

  return (
    <Modal show={show} onHide={handleCloseModal} size="lg" centered>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="cerhead">
          {isViewing
            ? t("education:view_education")
            : isEditing
              ? t("education:edit_education")
              : t("education:title")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {formData.map((form, formIndex) => {
          const { duplicateNames, duplicateCodes } = getDuplicateIndexes(
            form.specializationOthers
          );

          return (
            <div key={formIndex} className="border rounded p-3 mb-3">
              {/* ✅ FIRST ROW */}
              <div className="row g-3">
                {/* EDUCATION LEVEL */}
                <div className="col-md-4">
                  <label className="form-label">
                    {t("education:education_level")}{" "}
                    <span className="text-danger">*</span>
                  </label>

                  <select
                    className={`form-select ${errors[formIndex]?.educationLevel ? "is-invalid" : ""}`}
                    value={form.educationLevel}
                    onChange={(e) =>
                      onChange(formIndex, "educationLevel", e.target.value)
                    }
                    disabled={isViewing}
                  >
                    <option value="">{t("common:select")}</option>
                    {educationOptions?.map((item) => (
                      <option
                        key={item.documentTypeId}
                        value={item.documentTypeId}
                      >
                        {item.documentName}
                      </option>
                    ))}
                  </select>

                  {!isViewing && (
                    <small className="text-danger">
                      {errors[formIndex]?.educationLevel}
                    </small>
                  )}
                </div>

                {/* COURSE */}
                <div className="col-md-4">
                  <label className="form-label">
                    {t("education:course")}{" "}
                    <span className="text-danger">*</span>
                  </label>

                  {isViewing ? (
                    <div className="form-control-view">
                      {form.course || "-"}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className={`form-control ${errors[formIndex]?.course ? "is-invalid" : ""}`}
                      value={form.course}
                      placeholder={t("education:course_placeholder")}
                      onChange={(e) =>
                        onChange(formIndex, "course", e.target.value)
                      }
                    />
                  )}

                  {!isViewing && (
                    <small className="text-danger">
                      {errors[formIndex]?.course}
                    </small>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    {t("education:course_code")}{" "}
                    <span className="text-danger">*</span>
                  </label>

                  {isViewing ? (
                    <div className="form-control-view">
                      {form.courseCode || "-"}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className={`form-control ${errors[formIndex]?.courseCode ? "is-invalid" : ""
                        }`}
                      value={form.courseCode}
                      placeholder={t("education:course_code_placeholder")}
                      onChange={(e) =>
                        onChange(formIndex, "courseCode", e.target.value)
                      }
                    />
                  )}

                  {!isViewing && (
                    <small className="text-danger">
                      {errors[formIndex]?.courseCode}
                    </small>
                  )}
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  {/* TITLE ALWAYS TOP */}
                  {form.specializationOthers?.length > 0 && (
                    <>
                      <label className="form-label">
                        {t("education:specialization")}
                      </label>

                      <div className="row g-2 align-items-start mb-2">
                        <div className="col-md-5">
                          <label
                            className="form-label"
                            style={{ fontSize: "13px", fontWeight: "400" }}
                          >
                            {t("education:specialization_name")}
                          </label>
                        </div>

                        <div className="col-md-5">
                          <label
                            className="form-label"
                            style={{ fontSize: "13px", fontWeight: "400" }}
                          >
                            {t("education:specialization_code")}
                          </label>
                        </div>

                        <div className="col-md-2"></div>
                      </div>
                    </>
                  )}
                  {isViewing ? (
                    <div
                      style={{
                        maxHeight: "220px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        paddingRight: "5px",
                      }}
                    >
                      <div className="row">
                        {form.specializationOthers
                          ?.filter(
                            (s) =>
                              (typeof s === "string" && s.trim().length > 0) ||
                              (typeof s === "object" &&
                                typeof s?.name === "string" &&
                                s.name.trim().length > 0)
                          )
                          .map((s, i) => (
                            <div key={i} className="col-md-12 mb-2">
                              <div className="row g-2 align-items-start">
                                {/* SPECIALIZATION NAME */}
                                <div className="col-md-5">
                                  <input
                                    type="text"
                                    className="form-control-view"
                                    value={typeof s === "string" ? s : s.name}
                                    readOnly
                                  />
                                </div>

                                {/* SPECIALIZATION CODE */}
                                <div className="col-md-5">
                                  <input
                                    type="text"
                                    className="form-control-view"
                                    value={
                                      typeof s === "object"
                                        ? s.code || "-"
                                        : "-"
                                    }
                                    readOnly
                                  />
                                </div>

                                {/* EMPTY SPACE LIKE DELETE BUTTON */}
                                <div className="col-md-2"></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* INPUTS */}
                      {form.specializationOthers?.length > 0 && (
                        <div
                          style={{
                            maxHeight: "220px",
                            overflowY: "auto",
                            overflowX: "hidden",
                            paddingRight: "5px",
                          }}
                        >

                          <div className="row">
                            {form.specializationOthers.map((val, i) => (
                              <div key={i} className="col-md-12 mb-2">
                                <div className="row g-2 align-items-start">
                                  {/* SPECIALIZATION NAME */}
                                  <div className="col-md-5">
                                    <input
                                      type="text"
                                      className={`form-control ${duplicateNames.has(i)
                                          ? "is-invalid"
                                          : ""
                                        }`}
                                      value={val?.name || ""}
                                      placeholder={t("education:specialization_name")}
                                      onChange={(e) =>
                                        onChange(
                                          formIndex,
                                          "specialization",
                                          e.target.value,
                                          i
                                        )
                                      }
                                    />
                                  </div>

                                  {/* SPECIALIZATION CODE */}
                                  <div className="col-md-5">
                                    <input
                                      type="text"
                                      className={`form-control ${duplicateCodes.has(i)
                                          ? "is-invalid"
                                          : ""
                                        }`}
                                      value={val?.code || ""}
                                     placeholder={t("education:specialization_code")}
                                      onChange={(e) =>
                                        onChange(
                                          formIndex,
                                          "specializationCode",
                                          e.target.value,
                                          i
                                        )
                                      }
                                    />
                                  </div>

                                  {/* DELETE BUTTON */}
                                  <div className="col-md-2 d-flex align-items-center">
                                    {(!isEditing ||
                                      (isEditing && !val?.id)) && (
                                        <Button
                                          type="button"
                                          variant="link"
                                          className="action-btn delete-btn"
                                          onClick={() =>
                                            onRemoveSpec(formIndex, i)
                                          }
                                        >
                                          <img
                                            src={deleteIcon}
                                            alt="Delete"
                                            className="icon-16"
                                          />
                                        </Button>
                                      )}
                                  </div>
                                </div>
                                <div className="row mt-1">
                                  {/* NAME ERROR */}
                                  <div className="col-md-5">
                                    {/* Duplicate Name */}
                                    {duplicateNames.has(i) && (
                                      <small className="text-danger">
                                        {t(
                                          "education:duplicate_specialization"
                                        )}
                                      </small>
                                    )}

                                    {/* Name Required */}
                                    {val?.code?.trim() &&
                                      !val?.name?.trim() && (
                                        <small className="text-danger">
                                          {t(
                                            "education:specialization_required",
                                            "Specialization name is required"
                                          )}
                                        </small>
                                      )}
                                  </div>

                                  {/* CODE ERROR */}
                                  <div className="col-md-5">
                                    {/* Duplicate Code */}
                                    {duplicateCodes.has(i) && (
                                      <small className="text-danger">
                                        {t(
                                          "education:duplicate_specialization_code",
                                          "Duplicate specialization code"
                                        )}
                                      </small>
                                    )}

                                    {/* Code Required */}
                                    {val?.name?.trim() &&
                                      !val?.code?.trim() && (
                                        <small className="text-danger">
                                          {t(
                                            "education:specialization_code_required",
                                            "Specialization code is required"
                                          )}
                                        </small>
                                      )}
                                  </div>

                                  <div className="col-md-2"></div>
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      )}

                      {/* BUTTON ALWAYS BOTTOM */}
                      <div className="mt-2">
                        <button
                          type="button"
                          className="add-spec-btn"
                          onClick={() => onAddSpec(formIndex)}
                        >
                          {t("education:add_specialization")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>


            </div>
          );
        })}
      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <Button variant="outline-secondary" onClick={handleCloseModal}>
        {isViewing ? t("common:close") : t("common:cancel")}
        </Button>

        {!isViewing && (
          <Button variant="primary" onClick={saveExperience}>
            {isEditing ? t("common:update") : t("common:save")}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ExperienceModal;
