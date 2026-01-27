import {
  getGender,
  getReligion,
  getNationality,
  getMaritalStatus,
  getReservation,
  getEducationLevel,
  getSpecialization,
  getMandatoryQualification
} from "../../../shared/utils/masterHelpers";
 
import { formatDateDDMMYYYY } from "../../../shared/utils/dateUtils";
 
/* =================================================
   MAP ONLY:
   - Personal Details
   - Education Details
   - Experience Details
================================================= */
export const mapCandidateToPreview = (apiData = {}, masters = {}) => {
  const profile = apiData?.basicDetails?.candidateProfile || {};
  const address = apiData?.addressDetails || {};
  const educations = apiData?.educationDetails || [];
  const experiences = apiData?.experienceDetails || [];
 
  const yesNo = (v) => (v ? "Yes" : "No");
 
  /* ================= MASTER LOOKUPS ================= */
  const gender = getGender(masters, profile.genderId);
  const religion = getReligion(masters, profile.religionId);
  const nationality = getNationality(masters, profile.nationality);
  const maritalStatus = getMaritalStatus(masters, profile.maritalStatusId);
  const reservation = getReservation(masters, profile.reservationCategoryId);
 
  return {
    /* ================= PERSONAL DETAILS ================= */
    personalDetails: {
      fullName: profile.fullNameAadhar || "-",
      mobile: profile.contactNo || "-",
      email: profile.email || "-",
      motherName: profile.motherName || "-",
      fatherName: profile.fatherName || "-",
      spouseName: profile.spouseName || "-",
 
      dob: formatDateDDMMYYYY(profile.dateOfBirth) || "-",
      age: apiData?.age || "-",
 
      gender_name: gender?.gender_name || "-",
      religion_name: religion?.religion_name || "-",
      nationality_name: nationality?.country_name || "-",
      maritalStatus_name: maritalStatus?.marital_status || "-",
 
      caste: profile.community || "-",
      reservationCategory_name: reservation?.category_code || "-",
 
      address:
        `${address.addressLine1 || ""} ${address.addressLine2 || ""}`.trim() || "-",
 
      permanentAddress:
        `${address.permanentAddressLine1 || ""} ${address.permanentAddressLine2 || ""}`.trim() || "-",
 
      exService: yesNo(profile.exServiceman),
      physicalDisability: yesNo(profile.disability),
      centralGovtEmployment: yesNo(profile.centralGovtEmployed),
      servingLowerPost: yesNo(profile.employedInLowerPost),
      servingInGovt: yesNo(profile.isPublicSectorUndertaking),
      disciplinaryAction: yesNo(profile.anyDisciplinaryAction),
 
      disciplinaryDetails:
        profile.anyDisciplinaryAction ? profile.disciplinaryDetails || "-" : "-",
 
      socialMediaProfileLink: profile.socialMediaProfileLink || "-",
      cibilScore: profile.cibilScore || "-"
    },
 
    /* ================= EDUCATION DETAILS ================= */
    education: educations.map((item) => {
      const edu = item.education || {};
 
      const qualification = getMandatoryQualification(
        masters,
        edu.educationQualificationsId
      );
 
      const educationLevel = getEducationLevel(
        masters,
        qualification?.level_id
      );
 
      const specialization = edu.specializationId
        ? getSpecialization(masters, edu.specializationId)
        : null;
 
      return {
        institution: edu.institutionName || "-",
        startDate: formatDateDDMMYYYY(edu.startDate) || "-",
        endDate: formatDateDDMMYYYY(edu.endDate) || "-",
        percentage: edu.percentage ?? "-",
 
        educationLevel_name:
          educationLevel?.education_level_name || "-",
 
        mandatoryQualification_name:
          qualification?.qualification_name || "-",
 
        specialization_name:
          specialization?.specialization_name || "-"
      };
    }),
 
    /* ================= EXPERIENCE DETAILS ================= */
    experience: experiences.map((item) => {
      const exp = item.workExperience || {};
 
      return {
        org: exp.organizationName || "-",
        designation: exp.postHeld || "-",
        department: exp.role || "-",
        from: formatDateDDMMYYYY(exp.fromDate) || "-",
        to: exp.isPresentlyWorking
          ? "Present"
          : formatDateDDMMYYYY(exp.toDate) || "-",
        duration: `${exp.monthsOfExp || 0} Months`,
        nature: exp.workDescription || "-"
      };
    }),
 
    experienceSummary: {
      currentCtc: expSafeCurrency(
        experiences?.[0]?.workExperience?.currentCtc
      )
    }
  };
};
 
/* ================= SAFE CURRENCY ================= */
const expSafeCurrency = (value) =>
  value ? `₹${Number(value).toLocaleString()}` : "-";
 
// src/modules/candidatePreview/mappers/candidatePreviewMapper.js


export const mapJobPositionToRequisitionStrip = (
  apiData = {},
  masters = {}
) => {
  const positionObj =
    masters?.masterPositions?.find(
      (p) => p.masterPositionsId === apiData.masterPositionId
    );

  const employmentTypeObj =
    masters?.employementTypes?.find(
      (e) => e.employementTypeId === apiData.employmentType
    );

  const departmentObj =
    masters?.departments?.find(
      (d) => d.departmentId === apiData.deptId
    );

  /* ========= MASTER LOOKUPS ========= */
  const reservationMap =
    masters?.reservationCategories?.reduce((acc, r) => {
      acc[r.reservationCategoriesId] = r.categoryCode; // GEN / EWS / SC / ST / OBC
      return acc;
    }, {}) || {};

  const disabilityCodeMap =
    masters?.disabilityCategories?.reduce((acc, d) => {
      acc[d.disabilityCategoryId] = d.disabilityCode; // HI / VI / OC / ID
      return acc;
    }, {}) || {};

  /* ========= NATIONAL CATEGORY + DISABILITY (PIVOTED) ========= */
  const nationalCategoryCounts = {
    GEN: 0,
    EWS: 0,
    SC: 0,
    ST: 0,
    OBC: 0
  };

  const nationalDisabilityCounts = {
    HI: 0,
    VI: 0,
    OC: 0,
    ID: 0
  };

  apiData.positionCategoryNationalDistributions?.forEach((c) => {
    // Reservation categories
    if (!c.isDisability && c.reservationCategoryId) {
      const code = reservationMap[c.reservationCategoryId];
      if (code) {
        nationalCategoryCounts[code] += c.vacancyCount;
      }
    }

    // Disability categories
    if (c.isDisability && c.disabilityCategoryId) {
      const dCode = disabilityCodeMap[c.disabilityCategoryId];
      if (dCode) {
        nationalDisabilityCounts[dCode] += c.vacancyCount;
      }
    }
  });

  return {
    requisition_code: apiData.requisitionId || "-",

    position_title: positionObj?.positionName || "-",
    employment_type: employmentTypeObj?.typeName || "-",
    dept_name: departmentObj?.departmentName || "-",

    registration_start_date: formatToIST(apiData.createdDate),
    registration_end_date: formatToIST(apiData.modifiedDate),

    eligibility_age_min: apiData.eligibilityAgeMin ?? "-",
    eligibility_age_max: apiData.eligibilityAgeMax ?? "-",

    mandatory_experience: apiData.mandatoryExperience || "-",
    preferred_experience: apiData.preferredExperience || "-",

    no_of_vacancies: apiData.totalVacancies ?? 0,

    mandatory_qualification: apiData.mandatoryEducation || "-",
    preferred_qualification: apiData.preferredEducation || "-",

    roles_responsibilities: apiData.rolesResponsibilities || "-",

    isLocationWise: apiData.isLocationWise,

    /* ========= NATIONAL (READY FOR UI) ========= */
    nationalCategoryDistribution: {
      categories: nationalCategoryCounts,
      disabilities: nationalDisabilityCounts,
      totalVacancies: apiData.totalVacancies ?? 0
    },

    /* ========= STATE + CATEGORY + DISABILITY (PIVOTED) ========= */
    positionStateDistributions:
      apiData.positionStateDistributions?.map((state) => {
        const categoryCounts = {
          GEN: 0,
          EWS: 0,
          SC: 0,
          ST: 0,
          OBC: 0
        };

        const disabilityCounts = {
          HI: 0,
          VI: 0,
          OC: 0,
          ID: 0
        };

        state.positionCategoryDistributions?.forEach((c) => {
          // Reservation categories
          if (!c.isDisability && c.reservationCategoryId) {
            const code = reservationMap[c.reservationCategoryId];
            if (code) {
              categoryCounts[code] += c.vacancyCount;
            }
          }

          // Disability categories
          if (c.isDisability && c.disabilityCategoryId) {
            const dCode = disabilityCodeMap[c.disabilityCategoryId];
            if (dCode) {
              disabilityCounts[dCode] += c.vacancyCount;
            }
          }
        });

        return {
          stateId: state.stateId,
          totalVacancies: state.totalVacancies,
          localLanguage: state.localLanguage,

          categories: categoryCounts,
          disabilities: disabilityCounts
        };
      }) || []
  };
};



 
 
// shared/utils/dateUtils.js
export const formatToIST = (isoDate) => {
  if (!isoDate) return "-";
 
  const date = new Date(isoDate);
 
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};