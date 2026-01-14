import { useState } from "react";
import jobPositionApiService from "../services/jobPositionApiService";
import { mapAddPositionToUpdateDto } from "../mappers/positionUpdate.mapper";

export const useUpdateJobPosition = () => {
  const [loading, setLoading] = useState(false);

  const updatePosition = async ({
    positionId,
    requisitionId,
    formData,
    educationData,
    stateDistributions,
    nationalCategories,
    nationalDisabilities,
    reservationCategories,
    disabilityCategories,
    qualifications,
    certifications,
    approvedBy,
    approvedOn,
    indentFile,
    existingPosition
  }) => {
    setLoading(true);

    try {
      // 🔴 SINGLE SOURCE OF TRUTH
      const dto = mapAddPositionToUpdateDto({
        positionId,
        requisitionId,
        formData,
        educationData,
        stateDistributions,
        nationalCategories,
        nationalDisabilities,
        reservationCategories,
        disabilityCategories,
        qualifications,
        certifications,
        approvedBy,
        approvedOn,
        existingPosition
      });

      console.log("UPDATE DTO", dto); // ✅ DEBUG ONCE

      await jobPositionApiService.updatePosition({
        dto,
        indentFile
      });

      return true;
    } catch (err) {
      console.error("Update position failed", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updatePosition, loading };
};
