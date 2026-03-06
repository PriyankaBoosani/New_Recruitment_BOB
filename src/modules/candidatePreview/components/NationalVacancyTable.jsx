// src/modules/candidatePreview/components/NationalVacancyTable.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const NationalVacancyTable = ({ nationalCategoryDistribution }) => {
   const { t } = useTranslation(["candidateWorkflow", "common"]);
  if (!nationalCategoryDistribution) return null;

  const { categories, disabilities, totalVacancies } =
    nationalCategoryDistribution;

  return (
   <div className="category-reservation-card mt-3">
  <div className="category-title fs-14" style={{ fontWeight: 600 }}>
    {t("candidateWorkflow:category_wise_reservation")}
  </div>

  <div className="table-responsive">
    <table className="category-table">
      <thead>
        <tr>
          <th colSpan="6" className="group-header text-center">
            {t("candidateWorkflow:category")}
          </th>
          <th colSpan="4" className="group-header text-center">
            {t("candidateWorkflow:disability")}
          </th>
        </tr>
        <tr>
          <th className="text-center">{t("candidateWorkflow:gen")}</th>
          <th className="text-center">{t("candidateWorkflow:ews")}</th>
          <th className="text-center">{t("candidateWorkflow:sc")}</th>
          <th className="text-center">{t("candidateWorkflow:st")}</th>
          <th className="text-center">{t("candidateWorkflow:obc")}</th>
           <th className="text-center">{t("common:total")}</th>
          <th className="text-center">{t("candidateWorkflow:hi")}</th>
          <th className="text-center">{t("candidateWorkflow:vi")}</th>
          <th className="text-center">{t("candidateWorkflow:oc")}</th>
          <th className="text-center">{t("candidateWorkflow:id")}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{categories.GEN}</td>
          <td>{categories.EWS}</td>
          <td>{categories.SC}</td>
          <td>{categories.ST}</td>
          <td>{categories.OBC}</td>
          <td>{totalVacancies}</td>
          <td>{disabilities.HI}</td>
          <td>{disabilities.VI}</td>
          <td>{disabilities.OC}</td>
          <td>{disabilities.ID}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

  );
};

export default NationalVacancyTable;
