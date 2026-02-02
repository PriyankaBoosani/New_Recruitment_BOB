import { useState } from "react";
import jobPositionApiService from "../services/jobPositionApiService";
import { mapAddPositionToUpdateDto } from "../mappers/positionUpdate.mapper";

export const useUpdateJobPosition = () => {
  const [loading, setLoading] = useState(false);

  const updatePosition = async (payload) => {
    try {
      setLoading(true);

      const dto = mapAddPositionToUpdateDto(payload);

      console.log("UPDATE DTO", dto);

      const res = await jobPositionApiService.updatePosition({
        dto,
        indentFile: payload.indentFile
      });

      //  MATCH ACTUAL RESPONSE SHAPE
      if (!res?.success) {
        throw new Error(res?.message || "Update position failed");
      }

      return res.data; // success path only
    } catch (err) {
      console.error("Update position failed", err);
      throw err; //  DO NOT RETURN FALSE
    } finally {
      setLoading(false);
    }
  };

  return { updatePosition, loading };
};
