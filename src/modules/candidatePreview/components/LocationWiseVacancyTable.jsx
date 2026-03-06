import React from "react";
import { useTranslation } from "react-i18next";



const LocationWiseVacancyTable = ({
  positionStateDistributions = [],
  states = []

}) => {
  const { t } = useTranslation(["candidateWorkflow", "common"]);

  if (!positionStateDistributions.length) return null;

  // const stateMap = states.reduce((acc, s) => {
  //   acc[s.stateId] = s.stateName;
  //   return acc;
  // }, {});

  const stateMap = states.reduce((acc, s) => {
  const id = String(s.id || s.stateId || s.zonalStateID).toLowerCase();
  const name = s.name || s.stateName;

  acc[id] = name;
  return acc;
}, {});



  return (
    <div className="mt-3 p-3" style={{ backgroundColor: '#f5f7fb', borderRadius: '10px' }}>
      <div className="category-title fs-14" style={{ fontWeight: 600 }}>
       {t("category_wise_reservation_state")} 
      </div>

      <div className="table-responsive">
        <table className="table table-bordered small text-center mb-0">
          <thead>
            <tr>
              <th rowSpan="2" className="light_font fw-600 fs-13">{t("state_name")}</th>
              <th colSpan="6" className="light_font fw-600 fs-13" style={{ padding: '10px 8px' }}>{t("category")}</th>
              <th colSpan="4" className="light_font fw-600 fs-13" style={{ padding: '10px 8px' }}>{t("disability")}</th>
            </tr>
            <tr>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("gen")}</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("ews")}</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("sc")}</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("st")}</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("obc")}</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("common:total")}</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("hi")}</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("vi")}</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("oc")}</th>
              <th className="light_font fw-600 fs-12" style={{ padding: '10px 6px' }}>{t("id")}</th>
            </tr>
          </thead>

          <tbody>
            {positionStateDistributions.map((state, idx) => (
              <tr key={idx}>
               <td>
  {stateMap[
    String(state.stateId || state.zonalStateID).toLowerCase()
  ] || t("unknown")}
</td>


                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.GEN}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.EWS}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.SC}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.ST}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.categories.OBC}</td>
                <td className="fw-600" style={{ backgroundColor: '#f1f3f9', padding: '12px 6px' }}>{state.totalVacancies}</td>

                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.disabilities.HI}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.disabilities.VI}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.disabilities.OC}</td>
                <td className="fw-500" style={{ padding: '12px 6px' }}>{state.disabilities.ID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationWiseVacancyTable;
