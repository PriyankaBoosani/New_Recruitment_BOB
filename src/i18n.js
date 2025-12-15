import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import departmentEn from "./i18n/department.en.json";
import departmentHi from "./i18n/department.hi.json";
import validationEn from "./i18n/validation.en.json";
import validationHi from "./i18n/validation.hi.json";

// ⬅ Read persisted Redux value
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

i18n.use(initReactI18next).init({
  resources: {
    en: {
      department: departmentEn,
      validation: validationEn
    },
    hi: {
      department: departmentHi,
      validation: validationHi
    }
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { 
    escapeValue: false,
    defaultVariables: {
      min: 2,
      max: 100
    }
  },
});

export default i18n;
