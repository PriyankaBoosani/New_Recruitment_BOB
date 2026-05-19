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
  educationOptions
}) => {

  const { t } = useTranslation(["education", "common"]);

  const getDuplicateIndexes = (list = []) => {
    const map = {};
    const duplicates = new Set();

    list.forEach((val, index) => {
      const key = val?.name?.trim().toLowerCase();
      if (!key) return;

      if (map[key] !== undefined) {
        duplicates.add(index);
        duplicates.add(map[key]);
      } else {
        map[key] = index;
      }
    });
    return duplicates;
  };

  return (
    <Modal show={show} onHide={handleCloseModal} size="lg" centered>

      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="cerhead">
          {isViewing
            ? "View Education"
            : isEditing
              ? "Edit Education"
              : t("education:title")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {formData.map((form, formIndex) => {
          const duplicateIndexes = getDuplicateIndexes(form.specializationOthers);

          return (
            <div key={formIndex} className="border rounded p-3 mb-3">

              {/* ✅ FIRST ROW */}
              <div className="row g-3">

                {/* EDUCATION LEVEL */}
                <div className="col-md-4">
                  <label className="form-label">
                    {t("education:education_level")} <span className="text-danger">*</span>
                  </label>

                  <select
                    className={`form-select ${errors[formIndex]?.educationLevel ? "is-invalid" : ""}`}
                    value={form.educationLevel}
                    onChange={(e) =>
                      onChange(formIndex, "educationLevel", e.target.value)
                    }
                    disabled={isViewing}
                  >
                    <option value="">Select</option>
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
                    {t("education:course")} <span className="text-danger">*</span>
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
                    {t("education:course_code")} <span className="text-danger">*</span>
                  </label>

                  {isViewing ? (
                    <div className="form-control-view">
                      {form.courseCode || "-"}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className={`form-control ${errors[formIndex]?.courseCode ? "is-invalid" : ""}`}
                      value={form.courseCode}
                      placeholder={t("education:course_code_placeholder")}
                      onChange={(e) =>
                        onChange(formIndex, "course_code", e.target.value)
                      }
                    />
                  )}

                  {!isViewing && (
                    <small className="text-danger">
                      {errors[formIndex]?.course}
                    </small>
                  )}
                </div>
              </div>

              {/* ✅ SPECIALIZATION BELOW WITH SCROLL */}

              <div className="row mt-3">
                <div className="col-md-12">

                  {/* TITLE ALWAYS TOP */}
                  <label className="form-label">
                    {t("education:specialization")}
                  </label>

                  {isViewing ? (
                    <div
                      style={{
                        maxHeight: "220px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        paddingRight: "5px"
                      }}
                    >
                      <div className="row">
                        {form.specializationOthers
                          ?.filter(
                            (s) =>
                              (typeof s === "string" &&
                                s.trim().length > 0) ||
                              (typeof s === "object" &&
                                typeof s?.name === "string" &&
                                s.name.trim().length > 0)
                          )
                          .map((s, i) => (
                            <div
                              key={i}
                              className="col-md-6 mb-2"
                            >
                              <div className="row g-2 align-items-center">

                                <div className="col">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      typeof s === "string"
                                        ? s
                                        : s.name
                                    }
                                    readOnly
                                  />
                                </div>

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
                            paddingRight: "5px"
                          }}
                        >
                          <div className="row">
                            {form.specializationOthers.map((val, i) => (
                              <div key={i} className="col-md-6 mb-2">

                                <div className="row g-2 align-items-center">

                                  <div className="col">
                                    <input
                                      type="text"
                                      className={`form-control ${duplicateIndexes.has(i)
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      value={val?.name || ""}
                                      placeholder={t(
                                        "education:specialization_placeholder",
                                        { index: i + 1 }
                                      )}
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

                                  <div className="col-auto">
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
                                  </div>

                                </div>

                                {duplicateIndexes.has(i) && (
                                  <small className="text-danger">
                                    {t(
                                      "education:duplicate_specialization"
                                    )}
                                  </small>
                                )}

                              </div>
                            ))}
                          </div>

                          <small className="text-danger">
                            {errors[formIndex]?.specialization}
                          </small>
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

              {/* <div className="row mt-3">
                <div className="col-md-12">

                  {!isViewing && (
                    <label className="form-label">
                      {t("education:specialization")}
                    </label>
                  )}

                  {isViewing ? (
                    <div
                      style={{
                        maxHeight: "220px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        paddingRight: "5px"
                      }}
                    >
                      <div className="row">
                        {
                          form.specializationOthers?.filter(
                            (s) =>
                              (typeof s === "string" && s.trim().length > 0) ||
                              (typeof s === "object" &&
                                typeof s?.name === "string" &&
                                s.name.trim().length > 0)
                          ).length > 0 && (
                            <>
                              <label className="form-label">
                                {t("education:specialization")}
                              </label>

                              <div className="row">

                                {form.specializationOthers
                                  ?.filter(
                                    (s) =>
                                      (typeof s === "string" &&
                                        s.trim().length > 0) ||
                                      (typeof s === "object" &&
                                        typeof s?.name === "string" &&
                                        s.name.trim().length > 0)
                                  )
                                  .map((s, i) => (
                                    <div
                                      key={i}
                                      className="col-md-6 mb-2"
                                    >

                                      <div className="row g-2 align-items-center">

                                        <div className="col">
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={
                                              typeof s === "string"
                                                ? s
                                                : s.name
                                            }
                                            readOnly
                                          />
                                        </div>

                                        <div className="col-auto">
                                          <button
                                            className="remove-btn"
                                            style={{
                                              visibility: "hidden"
                                            }}
                                          >
                                            −
                                          </button>
                                        </div>

                                      </div>

                                    </div>
                                  ))}

                              </div>
                            </>
                          )
                        }
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          maxHeight: "220px",
                          overflowY: "auto",
                          overflowX: "hidden",
                          paddingRight: "5px"
                        }}
                      >
                        <div className="row">
                          {form.specializationOthers.map((val, i) => (
                            <div key={i} className="col-md-6 mb-2">

                              <div className="row g-2 align-items-center">

                                <div className="col">
                                  <input
                                    type="text"
                                    className={`form-control ${duplicateIndexes.has(i) ? "is-invalid" : ""}`}
                                    value={val?.name || ""}
                                    placeholder={t("education:specialization_placeholder", { index: i + 1 })}
                                    onChange={(e) =>
                                      onChange(formIndex, "specialization", e.target.value, i)
                                    }
                                  />
                                </div>

                                <Button
                                  type="button"
                                  variant="link"
                                  className="action-btn delete-btn"
                                  style={{
                                    visibility:
                                      (
                                        !isEditing ||
                                        (isEditing && !val?.id && !val?.name)
                                      )
                                        ? "visible"
                                        : "hidden"
                                  }}
                                  onClick={() => onRemoveSpec(formIndex, i)}
                                >
                                  <img
                                    src={deleteIcon}
                                    alt="Delete"
                                    className="icon-16"
                                  />
                                </Button>
                              </div>

                              {duplicateIndexes.has(i) && (
                                <small className="text-danger">
                                  {t("education:duplicate_specialization")}
                                </small>
                              )}

                            </div>
                          ))}
                        </div>
                         <small className="text-danger">
                          {errors[formIndex]?.specialization}
                        </small>
                      </div>


                      <button
                        type="button"
                        className="add-spec-btn mt-2"
                        onClick={() => onAddSpec(formIndex)}
                      >
                        {t("education:add_specialization")}
                      </button>
                    </>
                  )}

          

                </div>
              </div> */}

            </div>
          );
        })}

      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <Button variant="outline-secondary" onClick={handleCloseModal}>
          {isViewing ? "Close" : t("common:cancel")}
        </Button>

        {!isViewing && (
          <Button variant="primary" onClick={saveExperience}>
            {isEditing ? "Update" : t("common:save")}
          </Button>
        )}
      </Modal.Footer>

    </Modal>
  );
};

export default ExperienceModal;