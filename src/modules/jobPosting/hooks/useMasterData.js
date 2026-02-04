// src/modules/jobPosting/hooks/useMasterData.js
import { useEffect, useState } from "react";
import masterApiService from "../../master/services/masterApiService";
import { mapMasterResponse } from "../mappers/master.mapper";

export const useMasterData = () => {
  const [data, setData] = useState({
    departments: [],
    positions: [],
    jobGrades: [],
    employmentTypes: [],
    reservationCategories: [],
    disabilityCategories: [],
    educationTypes: [],
    qualifications: [],
    specializations: [],
    users: [],
    certifications: [],
    states: [],
    languages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchMaster = async () => {
      setLoading(true);
      try {
        // 🔥 CALL BOTH APIS IN PARALLEL
        const [masterRes, userRes, certRes] = await Promise.all([
          masterApiService.getMasterDisplayAll(),
          masterApiService.getUser(),
          masterApiService.getAllCertificates(),

        ]);

        const mapped = mapMasterResponse(
          masterRes.data,
          userRes.data,
          certRes.data,

        );

        setData({
          departments: mapped.departments,
          positions: mapped.positions,
          jobGrades: mapped.jobGrades,
          employmentTypes: mapped.employmentTypes,
          reservationCategories: mapped.reservationCategories,
          disabilityCategories: mapped.disabilityCategories,
          educationTypes: mapped.educationTypes,
          qualifications: mapped.qualifications,
          specializations: mapped.specializations,
          users: mapped.users,
          certifications: mapped.certifications,
          states: mapped.states,
          languages: mapped.languages,
        });

      } catch (err) {
        console.error(err);
        setError("Failed to load master data");
      } finally {
        setLoading(false);
      }
    };

    fetchMaster();
  }, []);

  return { ...data, loading, error };
};
