import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
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
  groupOptions,
  qualificationOptions,
  fetchIntegratedSpecializations,
  integratedSpecializationOptions,
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

  const integratedGroupOptions =
    qualificationOptions
      ?.filter((item) => {
        const levelName = educationOptions.find(
          (level) => level.documentTypeId === item?.qualification?.levelId
        )?.documentName;

        const qualificationName = item?.qualification?.qualificationName
          ?.trim()
          .toLowerCase();

        return (
          ["Graduation", "Post-Graduation"].includes(levelName) &&
          ![
            "other",
            "others",
            "other related fields",
            "any graduation",
            "any post-graduation",
          ].includes(qualificationName)
        );
      })
      .map((item) => ({
        label: item?.qualification?.qualificationName || "",
        value: item?.qualification?.educationQualificationsId || "",
      })) || [];

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      centered
      size="xl"
      dialogClassName="education-modal"
    >
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

          const selectedEducation = educationOptions.find(
            (item) => item.documentTypeId === form.educationLevel
          );

          const hideGroup =
            ["Any Graduation", "Any Post-Graduation"].includes(
              form.course?.trim()
            ) ||
            ["10th / SSC", "Intermediate / 12th / HSC"].includes(
              selectedEducation?.documentName
            );

          const readOnlyCodes =
            isEditing &&
            [
              "Graduation",
              "Post-Graduation",
              "Any Graduation",
              "Any Post-Graduation",
            ].includes(form.course?.trim());

          const showTopGroup =
            !hideGroup && (form.specializationOthers?.length || 0) === 0;
          return (
            <div key={formIndex} className="border rounded p-3 mb-3 errorcls">
              {/* ✅ FIRST ROW */}
              <div className="row g-3">
                {/* EDUCATION LEVEL */}
                <div className={form.group ? "col-md-2" : "col-md-2"}>
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
                <div
                  className={
                    form.integratedGroup?.length > 0 ? "col-md-2" : "col-md-3"
                  }
                >
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

                <div
                  className={
                    form.integratedGroup?.length > 0 ? "col-md-2" : "col-md-2"
                  }
                >
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
                      readOnly={readOnlyCodes}
                      style={{
                        backgroundColor: readOnlyCodes ? "#e9ecef" : "#fff",
                        cursor: readOnlyCodes ? "not-allowed" : "text",
                        color: readOnlyCodes ? "#6c757d" : "#212529",
                      }}
                      className={`form-control ${
                        errors[formIndex]?.courseCode ? "is-invalid" : ""
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

                {showTopGroup && !form.isIntegratedCourse && (
                  <div
                    className={
                      ["Graduation", "Post-Graduation"].includes(
                        selectedEducation?.documentName
                      )
                        ? "col-md-2"
                        : "col-md-3"
                    }
                  >
                    <label className="form-label">
                      {t("education:group")}
                      <span className="text-danger">*</span>
                    </label>

                    <Select
                      classNamePrefix="react-select"
                      options={groupOptions}
                      value={
                        groupOptions.find(
                          (option) => option.value === form.group
                        ) || null
                      }
                      onChange={(option) =>
                        onChange(formIndex, "group", option?.value || "")
                      }
                      placeholder={t("common:select")}
                      isDisabled={isViewing}
                      menuPlacement="bottom"
                      menuPosition="fixed"
                      menuShouldScrollIntoView={false}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: "42px",
                          borderRadius: "0.375rem", // Bootstrap radius
                          border: `1px solid ${
                            errors[formIndex]?.group
                              ? "#dc3545"
                              : state.isFocused
                                ? "#86b7fe"
                                : "#ced4da"
                          }`,
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: errors[formIndex]?.group
                              ? "#dc3545"
                              : state.isFocused
                                ? "#86b7fe"
                                : "#ced4da",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                    />

                    <small className="text-danger">
                      {errors[formIndex]?.group}
                    </small>
                  </div>
                )}

                {["Graduation", "Post-Graduation"].includes(
                  selectedEducation?.documentName
                ) &&
                  form.isIntegratedCourse === true && (
                    <div className="col-md-3">
                      <label className="form-label">
                        {t("education:integrated_group")} <span className="text-danger">*</span>
                      </label>

                      <Select
                        classNamePrefix="react-select"
                        isMulti
                        options={integratedGroupOptions}
                        value={integratedGroupOptions.filter((option) =>
                          form.integratedGroup?.some(
                            (group) => group?.value === option.value
                          )
                        )}
                        onChange={(options) => {
                          const selectedGroups =
                            options?.map((option, index) => ({
                              key: index,
                              value: option.value,
                            })) || [];

                          const selectedIds = selectedGroups.map(
                            (item) => item.value
                          );

                          onChange(
                            formIndex,
                            "integratedGroup",
                            selectedGroups
                          );

                          fetchIntegratedSpecializations(selectedIds);

                          // Clear selected integrated specializations
                          onChange(formIndex, "integratedSpecializations", []);
                        }}
                        placeholder={t("education:select_integrated_group")}
                        isDisabled={isViewing}
                        isClearable={!isViewing}
                        isSearchable={!isViewing}
                      />
                      {errors[formIndex]?.integratedGroup && (
                        <small className="text-danger">
                          {errors[formIndex].integratedGroup}
                        </small>
                      )}
                    </div>
                  )}
                {["Graduation", "Post-Graduation"].includes(
                  selectedEducation?.documentName
                ) && (
                  <div className="col-md-2">
                    <label className="form-label mb-2">{t("education:integrated_course")}</label>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`isIntegratedCourse-${formIndex}`}
                        checked={form.isIntegratedCourse === true}
                        disabled={isViewing}
                        onChange={(e) => {
                          const checked = e.target.checked;

                          onChange(formIndex, "isIntegratedCourse", checked);

                          if (checked) {
                            // Integrated course → clear normal group
                            onChange(formIndex, "group", "");
                          } else {
                            // Normal course → clear integrated data
                            onChange(formIndex, "integratedGroup", []);
                            onChange(
                              formIndex,
                              "integratedSpecializations",
                              []
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="row mt-3">
                <div className="col-md-12">
                  {/* TITLE ALWAYS TOP */}
                  {form.specializationOthers?.length > 0 && (
                    <>
                      <label className="form-label">
                        {t("education:specialization")}
                      </label>

                      <div
                        className="row g-2 align-items-start"
                        style={{ marginBottom: "2px" }}
                      >
                        <div className="col-md-3">
                          <label
                            className="form-label"
                            style={{ fontSize: "13px", fontWeight: "400" }}
                          >
                            {t("education:specialization_name")}
                          </label>
                        </div>

                        <div className="col-md-2">
                          <label
                            className="form-label"
                            style={{ fontSize: "13px", fontWeight: "400" }}
                          >
                            {t("education:specialization_code")}
                          </label>
                        </div>
                        {!hideGroup && (
                          <div className="col-md-3">
                            <label
                              className="form-label"
                              style={{ fontSize: "13px", fontWeight: "400" }}
                            >
                              {t("education:group")}
                            </label>
                          </div>
                        )}
                        {/* {form.integratedGroup?.length > 0 && (
                          <div className="col-md-3">
                            <label
                              className="form-label"
                              style={{ fontSize: "13px", fontWeight: "400" }}
                            >
                              Integrated Specilization
                            </label>
                          </div>
                        )} */}
                        <div className="col-md-1"></div>
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
                        marginTop: "0px",
                      }}
                    >
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
                              <div
                                className={form.group ? "col-md-3" : "col-md-3"}
                              >
                                <input
                                  style={{ width: "100%" }}
                                  type="text"
                                  className="form-control-view"
                                  value={typeof s === "string" ? s : s.name}
                                  readOnly
                                />
                              </div>

                              {/* SPECIALIZATION CODE */}
                              <div
                                className={form.group ? "col-md-2" : "col-md-2"}
                              >
                                <input
                                  type="text"
                                  style={{ width: "100%" }}
                                  className="form-control-view"
                                  value={
                                    typeof s === "object" ? s.code || "-" : "-"
                                  }
                                  readOnly
                                />
                              </div>

                              {/* GROUP */}
                              <div
                                className={form.group ? "col-md-3" : "col-md-3"}
                              >
                                <input
                                  type="text"
                                  style={{ width: "100%" }}
                                  className="form-control-view"
                                  value={
                                    typeof s === "object"
                                      ? s.groupName ||
                                        groupOptions.find(
                                          (g) => g.value === s.group
                                        )?.label ||
                                        "-"
                                      : "-"
                                  }
                                  readOnly
                                />
                              </div>

                              {/* INTEGRATED SPECIALIZATION */}
                              {/* {form.integratedGroup?.length > 0 && (
                                <div
                                  className={
                                    form.group ? "col-md-3" : "col-md-3"
                                  }
                                >
                                  <input
                                    type="text"
                                    style={{ width: "100%" }}
                                    className="form-control-view"
                                    value={
                                      typeof s === "object"
                                        ? (s.integratedSpecializations || [])
                                            .map(
                                              (id) =>
                                                (
                                                  integratedSpecializationOptions ||
                                                  []
                                                ).find(
                                                  (item) =>
                                                    item.specializationId === id
                                                )?.specializationName
                                            )
                                            .filter(Boolean)
                                            .join(", ") || "-"
                                        : "-"
                                    }
                                    readOnly
                                  />
                                </div>
                              )} */}
                              <div className="col-md-1"></div>
                            </div>
                          </div>
                        ))}
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
                            {form.specializationOthers.map((val, i) => {
                              const specializationName =
                                val?.specializationName || val?.name || "";

                              const isSystemSpecialization = [
                                "other related fields",
                                "others",
                              ].includes(
                                specializationName.trim().toLowerCase()
                              );

                              // Hide only existing system specializations.
                              // Keep newly added/blank rows visible.
                              if (isSystemSpecialization && val?.id) {
                                return null;
                              }

                              return (
                                <div key={i} className="col-md-12 mb-2">
                                  <div className="row g-2 align-items-start">
                                    {/* SPECIALIZATION NAME */}
                                    <div
                                      className={
                                        form.group ? "col-md-3" : "col-md-3"
                                      }
                                    >
                                      <input
                                        type="text"
                                        className={`form-control ${
                                          duplicateNames.has(i) ||
                                          errors[formIndex]?.specialization?.[i]
                                            ?.name
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        value={val?.name || ""}
                                        placeholder={t(
                                          "education:specialization_name"
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

                                    {/* SPECIALIZATION CODE */}
                                    <div
                                      className={
                                        form.group ? "col-md-2" : "col-md-2"
                                      }
                                    >
                                      <input
                                        type="text"
                                        className={`form-control ${
                                          duplicateCodes.has(i) ||
                                          (val?.name?.trim() &&
                                            !val?.code?.trim())
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        readOnly={readOnlyCodes && !!val?.id}
                                        style={{
                                          backgroundColor:
                                            readOnlyCodes && !!val?.id
                                              ? "#f8f9fa"
                                              : "#fff",
                                          cursor:
                                            readOnlyCodes && !!val?.id
                                              ? "not-allowed"
                                              : "text",
                                          color:
                                            readOnlyCodes && !!val?.id
                                              ? "#6c757d"
                                              : "#212529",
                                        }}
                                        value={val?.code || ""}
                                        placeholder={t(
                                          "education:specialization_code"
                                        )}
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

                                    {/* GROUP */}
                                    {!hideGroup && (
                                      <div
                                        className={
                                          form.group ? "col-md-3" : "col-md-3"
                                        }
                                      >
                                        <Select
                                          classNamePrefix="react-select"
                                          className={
                                            val?.name?.trim() &&
                                            !val?.group?.trim()
                                              ? "react-select-invalid"
                                              : ""
                                          }
                                          options={groupOptions}
                                          value={
                                            groupOptions.find(
                                              (option) =>
                                                option.value === val?.group
                                            ) || null
                                          }
                                          onChange={(option) =>
                                            onChange(
                                              formIndex,
                                              "specializationGroup",
                                              option?.value || "",
                                              i
                                            )
                                          }
                                          placeholder={t("common:select")}
                                          menuPlacement="bottom"
                                          menuPosition="fixed"
                                          menuShouldScrollIntoView={false}
                                          styles={{
                                            control: (base, state) => ({
                                              ...base,
                                              minHeight: "40px",
                                              borderRadius: "0.375rem",
                                              border: `1px solid ${
                                                val?.name?.trim() &&
                                                !val?.group?.trim()
                                                  ? "#dc3545"
                                                  : state.isFocused
                                                    ? "#86b7fe"
                                                    : "#ced4da"
                                              }`,
                                              boxShadow: "none",
                                              "&:hover": {
                                                borderColor:
                                                  val?.name?.trim() &&
                                                  !val?.group?.trim()
                                                    ? "#dc3545"
                                                    : state.isFocused
                                                      ? "#86b7fe"
                                                      : "#ced4da",
                                              },
                                            }),
                                            menu: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }),
                                          }}
                                        />
                                      </div>
                                    )}
                                    {/* {["Graduation", "Post-Graduation"].includes(
                                      selectedEducation?.documentName
                                    ) &&
                                      form.integratedGroup?.length > 0 && (
                                        <div className="col-md-3">
                                          <Select
                                            classNamePrefix="react-select"
                                            isMulti
                                            options={(
                                              integratedSpecializationOptions ||
                                              []
                                            )
                                              .filter((item) => {
                                                const name =
                                                  item?.specializationName
                                                    ?.trim()
                                                    .toLowerCase();

                                                return ![
                                                  "other",
                                                  "others",
                                                  "other related fields",
                                                ].includes(name);
                                              })
                                              .map((item) => ({
                                                label: item.specializationName,
                                                value: item.specializationId,
                                              }))}
                                            value={(
                                              integratedSpecializationOptions ||
                                              []
                                            )
                                              .map((item) => ({
                                                label: item.specializationName,
                                                value: item.specializationId,
                                              }))
                                              .filter((option) =>
                                                (
                                                  val?.integratedSpecializations ||
                                                  []
                                                ).includes(option.value)
                                              )}
                                            onChange={(options) => {
                                              const selectedIds =
                                                options?.map(
                                                  (option) => option.value
                                                ) || [];

                                              onChange(
                                                formIndex,
                                                "integratedSpecializations",
                                                selectedIds,
                                                i
                                              );
                                            }}
                                            placeholder={t("common:select")}
                                            isDisabled={isViewing}
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            styles={{
                                              menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                              }),
                                              menu: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                              }),
                                            }}
                                          />
                                        </div>
                                      )} */}

                                    {/* DELETE BUTTON */}
                                    <div className="col-md-1 d-flex align-items-center justify-content-center">
                                      {" "}
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
                                  <div
                                    className="row"
                                    style={{
                                      marginTop: "2px",
                                      minHeight: "18px",
                                    }}
                                  >
                                    {/* NAME ERROR */}
                                    <div className="col-md-3">
                                      {/* Duplicate Name */}
                                      {duplicateNames.has(i) && (
                                        <small
                                          className="text-danger"
                                          style={{
                                            fontSize: "12px",
                                            lineHeight: "14px",
                                            marginTop: "2px",
                                            display: "block",
                                          }}
                                        >
                                          {t(
                                            "education:duplicate_specialization"
                                          )}
                                        </small>
                                      )}

                                      {errors[formIndex]?.specialization?.[i]
                                        ?.name && (
                                        <small
                                          className="text-danger"
                                          style={{
                                            fontSize: "12px",
                                            lineHeight: "14px",
                                            marginTop: "2px",
                                            display: "block",
                                          }}
                                        >
                                          {
                                            errors[formIndex].specialization[i]
                                              .name
                                          }
                                        </small>
                                      )}

                                      {/* Name Required */}
                                      {val?.code?.trim() &&
                                        !val?.name?.trim() && (
                                          <small
                                            className="text-danger"
                                            style={{
                                              fontSize: "12px",
                                              lineHeight: "14px",
                                              marginTop: "2px",
                                              display: "block",
                                            }}
                                          >
                                            {t(
                                              "education:specialization_required",
                                              "Specialization name is required"
                                            )}
                                          </small>
                                        )}
                                    </div>

                                    {/* CODE ERROR */}
                                    <div className="col-md-2">
                                      {/* Duplicate Code */}
                                      {duplicateCodes.has(i) && (
                                        <small
                                          className="text-danger"
                                          style={{
                                            fontSize: "12px",
                                            lineHeight: "14px",
                                            marginTop: "2px",
                                            display: "block",
                                          }}
                                        >
                                          {t(
                                            "education:duplicate_specialization_code",
                                            "Duplicate specialization code"
                                          )}
                                        </small>
                                      )}

                                      {/* Code Required */}

                                      {val?.name?.trim() &&
                                        !val?.code?.trim() &&
                                        !duplicateCodes.has(i) && (
                                          <small
                                            className="text-danger"
                                            style={{
                                              fontSize: "12px",
                                              lineHeight: "14px",
                                              marginTop: "2px",
                                              display: "block",
                                            }}
                                          >
                                            {t(
                                              "education:specialization_code_required",
                                              "Specialization code is required"
                                            )}
                                          </small>
                                        )}
                                    </div>
                                    {!hideGroup && (
                                      <div className="col-md-3">
                                        {val?.name?.trim() &&
                                          !val?.group?.trim() && (
                                            <small
                                              className="text-danger"
                                              style={{
                                                fontSize: "12px",
                                                lineHeight: "14px",
                                                marginTop: "2px",
                                                display: "block",
                                              }}
                                            >
                                              {t("education:group_required")}
                                            </small>
                                          )}
                                      </div>
                                    )}
                                    <div className="col-md-2"></div>
                                    <div className="col-md-1"></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* BUTTON ALWAYS BOTTOM */}
                      {!form.isIntegratedCourse && (
                        <div className="mt-2">
                          <button
                            type="button"
                            className="add-spec-btn"
                            onClick={() => onAddSpec(formIndex)}
                          >
                            {t("education:add_specialization")}
                          </button>
                        </div>
                      )}
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
