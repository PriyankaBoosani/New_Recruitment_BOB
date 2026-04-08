import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../../../../../style/Experience.css";
import { useTranslation } from "react-i18next";

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
  educationOptions   // ✅ ADDED
}) => {

  const { t } = useTranslation(["education", "common"]);

  const getDuplicateIndexes = (list = []) => {
    const map = {};
    const duplicates = new Set();

    list.forEach((val, index) => {
      const key = val.trim().toLowerCase();
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

              <div className="row g-3">

                {/* EDUCATION LEVEL */}
                <div className="col-md-4">
                  <label className="form-label">
                    {t("education:education_level")} *
                  </label>

                  {isViewing ? (
                    <div className="form-control-view">
                      {form.educationLevel || "-"}
                    </div>
                  ) : (
                    <select
                      className={`form-select ${errors[formIndex]?.educationLevel ? "is-invalid" : ""}`}
                      value={form.educationLevel}
                      onChange={(e) =>
                        onChange(formIndex, "educationLevel", e.target.value)
                      }
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
                  )}

                  {!isViewing && (
                    <small className="text-danger">
                      {errors[formIndex]?.educationLevel}
                    </small>
                  )}
                </div>

                {/* COURSE */}
                <div className="col-md-4">
                  <label className="form-label">
                    {t("education:course")} *
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

                {/* SPECIALIZATION */}
                <div className="col-md-4">
                  <label className="form-label">
                    {t("education:specialization")}
                  </label>

                  {isViewing ? (
                    <div className="form-control-view">
                      {form.specializationOthers?.join(", ") || "-"}
                    </div>
                  ) : (
                    <>
                      {form.specializationOthers.map((val, i) => (
                        <div key={i} className="mb-2">

                          <div className="d-flex gap-2">
                            <input
                              type="text"
                              className={`form-control ${duplicateIndexes.has(i) ? "is-invalid" : ""}`}
                              value={val}
                              placeholder={t("education:search_placeholder", { index: i + 1 })}
                              onChange={(e) =>
                                onChange(
                                  formIndex,
                                  "specialization",
                                  e.target.value,
                                  i
                                )
                              }
                            />

                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() => onRemoveSpec(formIndex, i)}
                            >
                              −
                            </button>
                          </div>

                          {duplicateIndexes.has(i) && (
                            <small className="text-danger">
                              {t("education:duplicate_specialization")}
                            </small>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        className="add-spec-btn"
                        onClick={() => onAddSpec(formIndex)}
                      >
                        {t("education:add_specialization")}
                      </button>
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