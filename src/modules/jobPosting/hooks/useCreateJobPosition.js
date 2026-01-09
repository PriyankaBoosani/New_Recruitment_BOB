import { useState } from "react";
import jobPositionApiService from "../services/jobPositionApiService";
import { mapPositionToDto } from "../mappers/positionPayload.mapper";

export const useCreateJobPosition = () => {
  const [loading, setLoading] = useState(false);

  const createPosition = async ({
    formData,
    educationData,
    approvedBy,
    approvedOn,
    requisitionId,
    indentFile,
  }) => {
    try {
      setLoading(true);

      const dto = mapPositionToDto({
        formData,
        educationData,
        approvedBy,
        approvedOn,
        requisitionId,
      });

      await jobPositionApiService.createPosition({
        dto,
        indentFile,
      });

      return true;
    } catch (error) {
      console.error("Create position failed", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createPosition, loading };
};
