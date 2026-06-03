import { getMasterById } from "./masterLookup";

/* =========================
   DEPARTMENT
========================= */
export const getDepartment = (masters, deptId) =>
  getMasterById(masters, "departments", deptId, "department_id");

/* =========================
   CITY
========================= */
export const getCity = (masters, cityId) =>
  getMasterById(masters, "cities", cityId, "city_id");

/* =========================
   STATE
========================= */
export const getState = (masters, stateId) =>
  getMasterById(masters, "states", stateId, "state_id");

/* =========================
   LOCATION
========================= */
export const getLocation = (masters, locationId) =>
  getMasterById(masters, "locations", locationId, "location_id");

/* =========================
   JOB GRADE
========================= */
export const getJobGrade = (masters, gradeId) =>
  getMasterById(masters, "job_grades", gradeId, "job_grade_id");

/* =========================
   SKILL
========================= */
export const getSkill = (masters, skillId) =>
  getMasterById(masters, "skills", skillId, "skill_id");
/* =========================
   EMPLOYMENT TYPE
========================= */
export const getEmploymentType = (masters, employmentTypeId) =>
  getMasterById(
    masters,
    "employment_types",
    employmentTypeId,
    "employment_type_id"
  );

/* =========================
   COUNTRY (NATIONALITY)
========================= */
export const getNationality = (masters, countryId) =>
  getMasterById(masters, "countries", countryId, "countryId");

/* =========================
   GENDER
========================= */
export const getGender = (masters, genderId) =>
  getMasterById(masters, "genders", genderId, "genderId");

/* =========================
   MARITAL STATUS
========================= */
export const getMaritalStatus = (masters, maritalStatusId) =>
  getMasterById(
    masters,
    "marital_statuses",
    maritalStatusId,
    "maritalStatusId"
  );

/* =========================
   RELIGION
========================= */
export const getReligion = (masters, religionId) =>
  getMasterById(masters, "religions", religionId, "religionId");

/* =========================
   RESERVATION
========================= */
export const getReservation = (masters, reservationId) =>
  getMasterById(
    masters,
    "reservation_categories",
    reservationId,
    "reservationCategoriesId"
  );
/* =========================
   EDUCATION LEVEL
========================= */
export const getEducationLevel = (masters, educationLevelId) =>
  getMasterById(
    masters,
    "education_levels",
    educationLevelId,
    "documentTypeId"
  );

/* =========================
   SPECIALIZATION
========================= */
export const getSpecialization = (masters, specializationId) =>
  getMasterById(
    masters,
    "specializations",
    specializationId,
    "specializationId"
  );

/* =========================
   MANDATORY QUALIFICATION
========================= */
export const getMandatoryQualification = (masters, qualificationId) =>
  getMasterById(
    masters,
    "mandatory_qualifications",
    qualificationId,
    "educationQualificationsId"
  );
