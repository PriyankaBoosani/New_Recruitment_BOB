import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import departmentEn from "../i18n/json/department.en.json";
import departmentHi from "../i18n/json/department.hi.json";
import validationEn from "../i18n/json/validation.en.json";
import validationHi from "../i18n/json/validation.hi.json";
import locationEn from "../i18n/json/location.en.json";
import locationHi from "../i18n/json/location.hi.json";
import positionEn from "../i18n/json/position.en.json";
import positionHi from "../i18n/json/position.hi.json";

import categoryEn from "../i18n/json/category.en.json";    
import categoryHi from "../i18n/json/category.hi.json";     

import relaxationtypeEn from "../i18n/json/relaxation.en.json";
import relaxationtypeHi from "../i18n/json/relaxation.hi.json";
// Special Category translations
import specialCategoryEn from "../i18n/json/specialCategory.en.json";
import specialCategoryHi from "../i18n/json/specialCategory.hi.json";

import documentsEn from "../i18n/json/documents.en.json";
import documentsHi from "../i18n/json/documents.hi.json";


import interviewPanelEn from "../i18n/json/interviewPanel.en.json";
import interviewPanelHi from "../i18n/json/interviewPanel.hi.json";

import jobGradeEn from "../i18n/json/jobGrade.en.json";
import jobGradeHi from "../i18n/json/jobGrade.hi.json";

// User translations
import userEn from "../i18n/json/user.en.json";
import userHi from "../i18n/json/user.hi.json";

import genericOrAnnexuresEn from "../i18n/json/genericOrAnnexures.en.json";
import genericOrAnnexuresHi from "../i18n/json/genericOrAnnexures.hi.json";  

// ⬅ Read persisted Redux language value
let savedLang = "en";
try {
  const root = localStorage.getItem("persist:root");
  if (root) {
    const parsed = JSON.parse(root);
    const langState = JSON.parse(parsed.language);
    savedLang = langState.lang || "en";
  }
} catch (e) {
  console.log("Language parse error:", e);
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        department: departmentEn,
        user: userEn,
        jobGrade: jobGradeEn,
        specialCategory: specialCategoryEn,  
        documents: documentsEn,
        interviewPanel: interviewPanelEn, 
        location: locationEn,    
        position: positionEn,
        category: categoryEn,
        relaxationType: relaxationtypeEn  , 
        validation: validationEn,
        genericOrAnnexures: genericOrAnnexuresEn
      },
      hi: {
        department: departmentHi,
        user: userHi,
        jobGrade: jobGradeHi,
        specialCategory: specialCategoryHi,
        documents: documentsHi,
        interviewPanel: interviewPanelHi,
        location: locationHi,  
        position: positionHi,
        category: categoryHi,
        relaxationType: relaxationtypeHi,
        validation: validationHi,
        genericOrAnnexures: genericOrAnnexuresHi
      }
    },
    lng: savedLang,       // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
      defaultVariables: {
        min: 2,
        max: 100
      }
    }
  });

export default i18n;
