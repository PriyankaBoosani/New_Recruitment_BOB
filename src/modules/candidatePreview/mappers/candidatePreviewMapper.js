// import {
//   getGender,
//   getReligion,
//   getNationality,
//   getMaritalStatus,
//   getState,
//   getReservation,
//    getEducationLevel,
//   getSpecialization,
//   getMandatoryQualification
// } from "../../../shared/utils/masterHelpers";
// import { formatDateDDMMYYYY } from "../../../shared/utils/dateUtils";
// export const mapCandidateToPreview = (
//   apiData = {},
//   masters = {}
// ) => {
  
//   const profile = apiData?.basicDetails?.candidateProfile || {};
//   const address = apiData?.addressDetails || {};
//   const experiences = apiData?.experienceDetails || [];
//   const educations = apiData?.educationDetails || [];
//   const languagesKnown = apiData?.basicDetails?.languagesKnown || [];
// const documents = apiData?.documentDetails || [];

//   const yesNo = (value) => (value === true ? "YES" : "NO");

//   /* =========================
//      MASTER LOOKUPS (SAFE)
//   ========================= */
  
//   const gender = getGender?.(masters, profile.genderId);
//   const religion = getReligion?.(masters, profile.religionId);
//   const nationality = getNationality?.(masters, profile.nationality);
//   const maritalStatus = getMaritalStatus?.(
//     masters,
//     profile.maritalStatusId
//   );
//   const twinGender = getGender?.(masters, profile.twinGenderId);
//   const reservation = getReservation?.(masters, profile.reservationCategoryId);



//   /* =========================
//      DOCUMENT GROUPING
//   ========================= */
//   const groupDocs = (predicate) =>
//     documents.filter(predicate).map(d => ({
//       id: d.id,
//       name: d.fileName,
//       url: d.fileUrl,
//       displayname:d.displayName
//     }));

//   return {
//     /* =========================
//        PERSONAL DETAILS (UNCHANGED KEYS)
//     ========================= */
//     personalDetails: {
//       age:apiData.age || "-",
//       fullName: profile.fullNameAadhar || "-",
//       mobile: profile.contactNo || "-",
//       email: profile.email || "-",
//       motherName: profile.motherName || "-",
//       fatherName: profile.fatherName || "-",
//       spouseName: profile.spouseName || "-",
//       dob: formatDateDDMMYYYY(profile.dateOfBirth) || "-",
// socialMediaProfileLink: profile.socialMediaProfileLink || "-",
//         /* ================= TWIN DETAILS ================= */
//   isTwin: yesNo(profile.isTwin),

//   twinName:
//     profile.isTwin === true
//       ? profile.twinName || "-"
//       : "-",

//   twinGender_name:
//     profile.isTwin === true
//       ? twinGender?.gender_name || "-"
//       : "-",

//       /* 🔁 IDs (existing behaviour) */
//       gender: profile.genderId || "-",
//       religion: profile.religionId || "-",
//       nationality: profile.nationality || "-",
//       maritalStatus: profile.maritalStatusId || "-",
//       caste: profile.community || "-",

//       /* 🆕 DISPLAY NAMES (NEW – NON-BREAKING) */
//       gender_name: gender?.gender_name || "-",
//       religion_name: religion?.religion_name || "-",
//       nationality_name: nationality?.country_name || "-",
//       maritalStatus_name: maritalStatus?.marital_status || "-",

//       /* ================= ADDRESS ================= */
//       address: `${address.addressLine1 || ""} ${address.addressLine2 || ""}`.trim(),
//       permanentAddress: `${address.permanentAddressLine1 || ""} ${address.permanentAddressLine2 || ""}`.trim(),

//       /* ================= GOVT / SERVICE ================= */
//       centralGovtEmployment: yesNo(profile.centralGovtEmployed),
//       servingLowerPost: yesNo(profile.employedInLowerPost),
//       familyMember1984: yesNo(profile.riotVictimFamily),
//       religiousMinority: yesNo(profile.minority),
//       servingInGovt: yesNo(profile.isPublicSectorUndertaking),
//       disciplinaryAction: yesNo(profile.anyDisciplinaryAction),

//       disciplinaryDetails:
//         profile.anyDisciplinaryAction === true
//           ? profile.disciplinaryDetails || "-"
//           : "-",

//       exService: yesNo(profile.exServiceman),
//       physicalDisability: yesNo(profile.disability),
//       cibilScore: profile.cibilScore || "-",
//       reservationCategory: profile.reservationCategoryId || "-",
//       reservationCategory_name: reservation?.category_code || "-"

   
//     },

//     /* =========================
//        EXPERIENCE (UNCHANGED KEYS)
//     ========================= */
//     experience: experiences.map((e) => ({
//       org: e.workExperience.organizationName || "-",
//       designation: e.workExperience.postHeld || "-",
//       department: e.workExperience.role || "-",
//       from: formatDateDDMMYYYY(e.workExperience.fromDate) || "-",
//       to: e.workExperience.isPresentlyWorking
//         ? "Present"
//         : formatDateDDMMYYYY(e.workExperience.toDate) || "-",
//       duration: `${e.workExperience.monthsOfExp || 0} Months`,
//       nature: e.workExperience.workDescription || "-"
//     })),

//     experienceSummary: {
//       total: `${experiences.reduce(
//         (sum, e) => sum + (e.workExperience.monthsOfExp || 0),
//         0
//       )} Months`,
//       relevant: "-",
//       designation:
//         experiences[0]?.workExperience?.postHeld || "-",
//          currentCtc:
//     experiences[0]?.workExperience?.currentCtc
//       ? `₹${experiences[0].workExperience.currentCtc.toLocaleString()}`
//       : "-",
//     },

//     /* =========================
//        EDUCATION (🆕 SAFE ADDITION)
//     ========================= */
//     // education: educations.map((e) => ({
//     //   qualification_id: e.education.educationTypeId,
//     //   educationQualificationsId: e.education.educationQualificationsId || "-",
//     //   institution: e.education.institutionName || "-",
//     //   specialization:e.education.specializationId || "-",
//     //   percentage: e.education.percentage ?? "-",
//     //   startDate: e.education.startDate || "-",
//     //   endDate: e.education.endDate || "-",
//     // })),

//     education: educations.map((e) => {
      

//         const specialization = getSpecialization(
//         masters,
//         e.education.specializationId
//         );

//         const mandatoryQualification = getMandatoryQualification(
//         masters,
//         e.education.educationQualificationsId
//         );
//         console.log("mandatoryQualification", mandatoryQualification)

//         const educationLevel = getEducationLevel(
//         masters,
//         mandatoryQualification.level_id
//         );
// console.log("educationLevel", educationLevel)
//         return {
//         qualification_id: e.education.educationTypeId || "-",
//         institution: e.education.institutionName || "-",
//         percentage: e.education.percentage ?? "-",
//         startDate: formatDateDDMMYYYY(e.education.startDate) || "-",
//         endDate: formatDateDDMMYYYY(e.education.endDate) || "-",

//         /* 🆕 Display values */
//         educationLevel_name:
//           educationLevel?.education_level_name || "-",

//         specialization_name:
//           specialization?.specialization_name || "-",

//         mandatoryQualification_name:
//           mandatoryQualification?.qualification_name || "-"
//         };
//     }),


//     /* =========================
//        LANGUAGES (🆕 SAFE ADDITION)
//        (Not used yet, but future-ready)
//     ========================= */
//     // languages: languagesKnown.map((l) => {
//     //   const lang = getLanguage?.(masters, l.languageId);
//     //   return {
//     //     language_id: l.languageId,
//     //     language_name: lang?.language_name || "-",
//     //     canRead: yesNo(l.canRead),
//     //     canWrite: yesNo(l.canWrite),
//     //     canSpeak: yesNo(l.canSpeak),
//     //   };
//     // }),

//     /* =========================
//        DOCUMENT DETAILS (NEW)
//     ========================= */
//   documents: {
//   /* ===== PHOTO & SIGNATURE ===== */
//   photo: groupDocs(d =>
//     d.displayName?.toLowerCase().includes("photo")
//   ),

//   signature: groupDocs(d =>
//     d.displayName?.toLowerCase().includes("signature")
//   ),

//   /* ===== RESUME ===== */
//   resume: groupDocs(d =>
//     d.displayName?.toLowerCase().includes("resume")
//   ),

//   /* ===== PAYSLIPS ===== */
//   payslips: groupDocs(d =>
//     d.displayName?.toLowerCase().includes("payslip")
//   ),

//   /* ===== EDUCATION CERTIFICATES ===== */
//   educationCertificates: groupDocs(d =>
//     d.displayName?.toLowerCase().includes("board") ||
//     d.displayName?.toLowerCase().includes("intermediate") ||
//     d.displayName?.toLowerCase().includes("10th") ||
//     d.displayName?.toLowerCase().includes("graduation") ||
//     d.displayName?.toLowerCase().includes("post-graduation")
//   ),

//   /* ===== IDENTITY PROOFS ===== */
//   identityProofs: groupDocs(d =>
//     d.displayName?.toLowerCase().includes("aadhar") ||
//     d.displayName?.toLowerCase().includes("proof of identity") ||
//     d.displayName?.toLowerCase().includes("pan") ||
//     d.displayName?.toLowerCase().includes("birth")
//   ),

//   /* ===== COMMUNITY / CASTE ===== */
//   communityCertificates: groupDocs(d =>
//     d.displayName?.toLowerCase().includes("community")
//   ),

//   /* ===== DISABILITY ===== */
//   disabilityCertificates: groupDocs(d =>
//     d.displayName?.toLowerCase().includes("disability")
//   ),
// }

//   };
// };


// import {
//   getGender,
//   getReligion,
//   getNationality,
//   getMaritalStatus,
//   getReservation,
//   getEducationLevel,
//   getSpecialization,
//   getMandatoryQualification
// } from "../../../shared/utils/masterHelpers";
// import { formatDateDDMMYYYY } from "../../../shared/utils/dateUtils";

// /* ===============================
//    MAIN MAPPER
// ================================ */
// export const mapCandidateToPreview = (apiData = {}, masters = {}) => {
//   /* ===============================
//      SAFE SOURCE OBJECTS
//   ================================ */
//   const profile = apiData?.basicDetails?.candidateProfile || {};
//   const address = apiData?.addressDetails || {};
//   const educations = apiData?.educationDetails || [];
//   const experiences = apiData?.experienceDetails || [];
//   const documents = apiData?.documentDetails || [];

//   /* ===============================
//      HELPERS
//   ================================ */
//   const yesNo = (v) => (v ? "Yes" : "No");

//   const groupDocs = (matchFn) =>
//     documents
//       .filter(d => {
//         const label = (d.displayName || d.fileName || "").toLowerCase();
//         return matchFn(label);
//       })
//       .map(d => ({
//         id: d.id,
//         name: d.fileName || "-",
//         displayname: d.displayName || d.fileName || "-",
//         url: d.fileUrl
//       }));

//   /* ===============================
//      MASTER LOOKUPS
//   ================================ */
//   const gender = getGender(masters, profile.genderId);
//   const religion = getReligion(masters, profile.religionId);
//   const nationality = getNationality(masters, profile.nationality);
//   const maritalStatus = getMaritalStatus(masters, profile.maritalStatusId);
//   const reservation = getReservation(masters, profile.reservationCategoryId);

//   /* ===============================
//      RETURN SHAPE (UI EXPECTS THIS)
//   ================================ */
//   return {
//     /* ========= PERSONAL DETAILS ========= */
//     personalDetails: {
//       fullName: profile.fullNameAadhar || "-",
//       mobile: profile.contactNo || "-",
//       email: profile.email || "-",
//       motherName: profile.motherName || "-",
//       fatherName: profile.fatherName || "-",
//       spouseName: profile.spouseName || "-",
//       dob: formatDateDDMMYYYY(profile.dateOfBirth) || "-",
//       age: apiData?.age || "-",

//       gender_name: gender?.gender_name || "-",
//       religion_name: religion?.religion_name || "-",
//       nationality_name: nationality?.country_name || "-",
//       maritalStatus_name: maritalStatus?.marital_status || "-",

//       caste: profile.community || "-",
//       reservationCategory_name: reservation?.category_code || "-",

//       address: `${address.addressLine1 || ""} ${address.addressLine2 || ""}`.trim() || "-",
//       permanentAddress:
//         `${address.permanentAddressLine1 || ""} ${address.permanentAddressLine2 || ""}`.trim() || "-",

//       exService: yesNo(profile.exServiceman),
//       physicalDisability: yesNo(profile.disability),
//       centralGovtEmployment: yesNo(profile.centralGovtEmployed),
//       servingLowerPost: yesNo(profile.employedInLowerPost),
//       servingInGovt: yesNo(profile.isPublicSectorUndertaking),
//       disciplinaryAction: yesNo(profile.anyDisciplinaryAction),
//       disciplinaryDetails: profile.disciplinaryDetails || "-",

//       socialMediaProfileLink: profile.socialMediaProfileLink || "-",
//       cibilScore: profile.cibilScore || "-"
//     },

//     /* ========= EDUCATION ========= */
//     education: educations.map(e => {
//       const qualification = getMandatoryQualification(
//         masters,
//         e.education.educationQualificationsId
//       );
//       const educationLevel = getEducationLevel(
//         masters,
//         qualification?.level_id
//       );
//       const specialization = e.education.specializationId
//         ? getSpecialization(masters, e.education.specializationId)
//         : null;

//       return {
//         institution: e.education.institutionName || "-",
//         startDate: formatDateDDMMYYYY(e.education.startDate) || "-",
//         endDate: formatDateDDMMYYYY(e.education.endDate) || "-",
//         percentage: e.education.percentage ?? "-",

//         educationLevel_name: educationLevel?.education_level_name || "-",
//         mandatoryQualification_name: qualification?.qualification_name || "-",
//         specialization_name: specialization?.specialization_name || "-"
//       };
//     }),

//     /* ========= EXPERIENCE ========= */
//     experience: experiences.map(exp => ({
//       org: exp.workExperience.organizationName || "-",
//       designation: exp.workExperience.postHeld || "-",
//       department: exp.workExperience.role || "-",
//       from: formatDateDDMMYYYY(exp.workExperience.fromDate) || "-",
//       to: exp.workExperience.isPresentlyWorking
//         ? "Present"
//         : formatDateDDMMYYYY(exp.workExperience.toDate) || "-",
//       duration: `${exp.workExperience.monthsOfExp || 0} Months`,
//       nature: exp.workExperience.workDescription || "-"
//     })),

//     experienceSummary: {
//       currentCtc: expSafeCurrency(experiences?.[0]?.workExperience?.currentCtc)
//     },

//     /* ========= DOCUMENTS ========= */
//     documents: {
//       photo: groupDocs(l => l.includes("photo")),
//       signature: groupDocs(l => l.includes("signature")),
//       resume: groupDocs(l => l.includes("resume")),
//       payslips: groupDocs(l => l.includes("payslip")),
//       educationCertificates: groupDocs(
//         l =>
//           l.includes("board") ||
//           l.includes("intermediate") ||
//           l.includes("graduation") ||
//           l.includes("post-graduation") ||
//           l.includes("10th")
//       ),
//       identityProofs: groupDocs(
//         l =>
//           l.includes("aadhar") ||
//           l.includes("identity") ||
//           l.includes("pan") ||
//           l.includes("birth")
//       ),
//       communityCertificates: groupDocs(l => l.includes("community")),
//       disabilityCertificates: groupDocs(l => l.includes("disability"))
//     }
//   };
// };

// /* ===============================
//    CURRENCY FORMATTER
// ================================ */
// const expSafeCurrency = (value) =>
//   value ? `₹${Number(value).toLocaleString()}` : "-";


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
