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


// const findById = (arr, key, id) =>
//   arr?.find(x => String(x[key]) === String(id));

const findById = (arr = [], key, id) =>
  arr.find(x => String(x[key]) === String(id));


const getStateName = (masters, id) =>
  findById(masters.states, "stateId", id)?.stateName || "-";

const getDistrictName = (masters, id) =>
  findById(masters.districts, "districtId", id)?.districtName || "-";

const getCityName = (masters, id) =>
  findById(masters.cities, "cityId", id)?.cityName || "-";

const getPincode = (masters, id) =>
  findById(masters.pincodes, "pincodeId", id)?.pin || "-";


const getZonalState = (masters, id) =>
  findById(masters?.zonalStats || [], "zonalStateID", id)?.stateName || "-";

const getInterviewCentreName = (masters, id) =>
  findById(
    masters?.interviewCenters || [],
    "interviewCentreId",
    id
  )?.interviewCentre || "-";







/* ===============================
   SINGLE SOURCE OF TRUTH
================================ */
export const mapCandidateToPreview = (apiData = {}, masters = {}) => {
  const profile = apiData?.basicDetails?.candidateProfile || {};
  const address = apiData?.addressDetails || {};
  // const locationprefApiData = apiData?.locationPreference
  const locationprefApiData = apiData?.locationPreference || {};
  const expectedCtcFormatted = safeCurrency(
    locationprefApiData?.expectedCtc
  );


  /* ================= ADDRESS NAME RESOLVE ================= */

  const presentCity = getCityName(masters, address.cityId);
  const presentDistrict = getDistrictName(masters, address.districtId);
  const presentState = getStateName(masters, address.stateId);
  const presentPin = getPincode(masters, address.pincodeId);

  const statePreference1 = getZonalState(masters, locationprefApiData.statePreference1);
  const statePreference2 = getZonalState(masters, locationprefApiData.statePreference2);
  const statePreference3 = getZonalState(masters, locationprefApiData.statePreference3);

  const locationPreference1 = getInterviewCentreName(masters, locationprefApiData.locationPreference1);
  const locationPreference2 = getInterviewCentreName(masters, locationprefApiData.locationPreference2);
  const locationPreference3 = getInterviewCentreName(masters, locationprefApiData.locationPreference3);

  const examCenterName =
    getInterviewCentreName(masters, locationprefApiData.interviewCenter);


  const permanentCity = getCityName(masters, address.permanentCityId);
  const permanentDistrict = getDistrictName(masters, address.permanentDistrictId);
  const permanentState = getStateName(masters, address.permanentStateId);
  const permanentPin = getPincode(masters, address.permanentPincodeId);

  const presentAddressFull = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    presentDistrict,
    presentState,
  ].filter(Boolean).join(", ");

  const permanentAddressFull = [
    address.permanentAddressLine1,
    address.permanentAddressLine2,
    address.permanentCity,
    permanentDistrict,
    permanentState,
  ].filter(Boolean).join(", ");

  const educations = apiData?.educationDetails || [];
  const experiences = apiData?.experienceDetails || [];
  const documents = apiData?.documentDetails || [];

  const yesNo = (v) => (v ? "Yes" : "No");

  /* ================= MASTER LOOKUPS ================= */
  const gender = getGender(masters, profile.genderId);
  const religion = getReligion(masters, profile.religionId);
  const nationality = getNationality(masters, profile.nationality);
  const maritalStatus = getMaritalStatus(masters, profile.maritalStatusId);
  const reservation = getReservation(masters, profile.reservationCategoryId);


  /* ========= DOCUMENT GROUP ========= */
  const groupDocs = (fn) =>
    documents
      .filter(d => fn((d.displayName || d.fileName || "").toLowerCase()))

      .map(d => {
        const rawName = d.displayName || d.fileName || "";


        const cleanedName = rawName
          .replace(/^candidate_[a-z0-9-]+_/i, "")
          .replace(/_/g, " ")
          .trim();

        return {
          id: d.id,
          name: cleanedName || "Document",
          fileName: d.fileName,
          url: d.fileUrl,
          status: d.documentScreeningStatus || "Pending"
        };
      });

  //       .map(d => ({
  //   id: d.id,
  //  name: d.displayName || d.fileName,
  //  fileName: d.fileName,
  //  url: d.fileUrl,


  //   status: d.documentScreeningStatus || "Pending"
  // }));


  return {
    /* ================= PERSONAL ================= */
    personalDetails: {
      fullName: profile.firstName + " " + profile.middleName + " " + profile.lastName || "-",
      mobile: profile.contactNo || "-",
      email: profile.email || "-",
      motherName: profile.motherName || "-",
      fatherName: profile.fatherName || "-",
      spouseName: profile.spouseName || "-",
      dob: formatDateDDMMYYYY(profile.dateOfBirth) || "-",
      age: apiData?.age || "-",

      gender_name: gender?.gender || "-",
      religion_name: religion?.religion || "-",
      nationality_name: nationality?.countryName || "-",
      maritalStatus_name: maritalStatus?.maritalStatus || "-",

      caste: profile.community || "-",
      reservationCategory_name: reservation?.categoryName || "-",

      // address: `${address.addressLine1 || ""} ${address.addressLine2 || ""}`.trim() || "-",
      // permanentAddress:
      //   `${address.permanentAddressLine1 || ""} ${address.permanentAddressLine2 || ""}`.trim() || "-",
      address: presentAddressFull + " - " + address.pincode || "-",
      permanentAddress: permanentAddressFull + " - " + address.permanentPincode || "-",


      exService: yesNo(profile.exServiceman),
      physicalDisability: yesNo(profile.disability),
      centralGovtEmployment: yesNo(profile.centralGovtEmployed),
      servingLowerPost: yesNo(profile.employedInLowerPost),
      servingInGovt: yesNo(profile.isPublicSectorUndertaking),
      familyMember1984: yesNo(profile.familyMember1984),
      riotVictimFamily: yesNo(profile.riotVictimFamily),
      disciplinaryAction: yesNo(profile.anyDisciplinaryAction),
      minority: yesNo(profile.minority),
      disciplinaryDetails: profile.disciplinaryDetails || "-",

      socialMediaProfileLink: profile.socialMediaProfileLink || "-",
      cibilScore: profile.cibilScore || "-",
      expectedCtc: expectedCtcFormatted,
      isTwin: profile.isTwin ? "Yes" : "No",
      twinName: profile.twinName || "-",

      statePreference1: statePreference1,
      statePreference2: statePreference2,
      statePreference3: statePreference3,

      locationPreference1: locationPreference1,
      locationPreference2: locationPreference2,
      locationPreference3: locationPreference3,
      examCenter: examCenterName,


    },

    /* ================= EDUCATION ================= */
    education: educations.map(item => {
      const edu = item.education || {};
      const qualification = getMandatoryQualification(
        masters,
        edu.educationQualificationsId
      );

      const educationLevel = getEducationLevel(
        masters,
        qualification?.levelId
      );

      const specialization = edu.specializationId
        ? getSpecialization(masters, edu.specializationId)
        : null;

      return {
        institution: edu.institutionName || "-",
        universityName: edu.universityName || "-",
        startDate: formatDateDDMMYYYY(edu.startDate) || "-",
        endDate: formatDateDDMMYYYY(edu.endDate) || "-",
        // percentage:
        //   edu.percentage != null
        //     ? Number(edu.percentage) < 10
        //       ? `${edu.percentage} CGPA`
        //       : `${edu.percentage}%`
        //     : "-",
        // percentage: edu.percentage ?? "-",

        percentage:
          edu.percentage != null
            ? (() => {
              const value = Number(edu.percentage).toFixed(2);
              return Number(edu.percentage) < 10
                ? `${value} CGPA`
                : `${value}%`;
            })()
            : "-",
        educationLevel_name: educationLevel?.documentName || "-",
        mandatoryQualification_name: qualification?.qualificationName || "-",
        specialization_name: specialization?.specializationName || "-"
      };
    }),

    /* ================= EXPERIENCE ================= */
    experience: experiences.map(e => ({
      org: e.workExperience.organizationName || "-",
      designation: e.workExperience.postHeld || "-",
      department: e.workExperience.role || "-",
      from: formatDateDDMMYYYY(e.workExperience.fromDate) || "-",
      to: e.workExperience.isPresentlyWorking
        ? "Present"
        : formatDateDDMMYYYY(e.workExperience.toDate) || "-",
      duration: `${e.workExperience.monthsOfExp || 0} Months`,
      nature: e.workExperience.workDescription || "-"
    })),

    experienceSummary: {
      currentCtc: safeCurrency(
        experiences?.[0]?.workExperience?.currentCtc
      )
    },
    /* ================= DOCUMENTS ================= */
    documents: {
      allDocs: groupDocs(() => true),
    }
  };
};


const safeCurrency = (value) =>
  value && Number(value) > 0
    ? `₹${Number(value).toLocaleString("en-IN")}`
    : "-";


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


  const formatExperience = (months) => {
    if (months == null) return null;

    const totalMonths = Number(months);

    if (isNaN(totalMonths)) return null;

    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
    }

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    }

    return `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
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
  const totalMonths = apiData.mandatoryExperienceMonths ?? 0;

  const mandatoryYears = Math.floor(totalMonths / 12);
  const mandatoryMonths = totalMonths % 12;

  return {
    requisition_code: apiData.requisitionId || "-",

    position_title: positionObj?.positionName || "-",
    employment_type: employmentTypeObj?.typeName || "-",
    dept_name: departmentObj?.departmentName || "-",






    /*  ADD THESE */
    contract_years: apiData.contractYears ?? 0,
    mandatory_experience_years: mandatoryYears,
    mandatory_experience_months: mandatoryMonths,
    registration_start_date: formatToIST(apiData.createdDate),
    registration_end_date: formatToIST(apiData.modifiedDate),

    eligibility_age_min: apiData.eligibilityAgeMin ?? "-",
    eligibility_age_max: apiData.eligibilityAgeMax ?? "-",

    mandatory_experience: apiData.mandatoryExperience || "-",
    preferred_experience: apiData.preferredExperience || "NA",

    no_of_vacancies: apiData.totalVacancies ?? 0,

    mandatory_qualification: apiData.mandatoryEducation || "-",
    preferred_qualification: apiData.preferredEducation?.trim() || "NA",

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


/* 
   MAP REQUISITION → REQUISITION STRIP HEADER*/
export const mapRequisitionToStripHeader = (requisition = {}) => {
  return {
    requisition_id: requisition.id,              //  UUID (for API)
    requisition_code: requisition.requisitionCode, //  Display
    requisition_title: requisition.requisitionTitle || "-",
    registration_start_date: requisition.startDate || "-",
    registration_end_date: requisition.endDate || "-"
  };
};



/* 
   MAP POSITION LIST ITEM (FOR DROPDOWN)
 */
export const mapPositionListItem = (apiItem = {}) => {
  return {
    positionId: apiItem.jobPositions?.positionId,
    positionName: apiItem.masterPositions?.positionName || "-",
    masterPositionId: apiItem.masterPositions?.masterPositionsId
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