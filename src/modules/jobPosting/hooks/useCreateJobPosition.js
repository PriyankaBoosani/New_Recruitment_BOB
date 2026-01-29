// src/modules/jobPosting/hooks/useCreateJobPosition.js

import { useState } from "react";
import jobPositionApiService from "../services/jobPositionApiService";
import { mapAddPositionToCreateDto } from "../mappers/jobPositionCreateMapper";

export const useCreateJobPosition = () => {
  const [loading, setLoading] = useState(false);

  const createPosition = async ({
    formData,
    educationData,
    approvedBy,
    approvedOn,
    requisitionId,
    indentFile,
    indentName,

    currentState,
    stateDistributions,
    reservationCategories,
    disabilityCategories,
    nationalCategories,
    nationalDisabilities,
    qualifications,
    certifications,
  }) => {
    try {
      setLoading(true);

      const dto = mapAddPositionToCreateDto({
        formData,
        educationData,
        requisitionId,
        approvedBy,
        approvedOn,
        indentName,
        currentState,
        stateDistributions,
        reservationCategories,
        disabilityCategories,
        nationalCategories,
        nationalDisabilities,
        qualifications,
        certifications,
      });

      console.log("FINAL CREATE DTO", dto);

      await jobPositionApiService.createPosition({
        dto,
        indentFile,
      });

      return true;
    } catch (err) {
      console.error("Create position failed", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createPosition, loading };
};
