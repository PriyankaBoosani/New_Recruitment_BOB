// src/modules/jobPosting/hooks/useCreateJobPosition.js

import { useState } from "react";
import jobPositionApiService from "../services/jobPositionApiService";
import { mapAddPositionToCreateDto } from "../mappers/jobPositionCreateMapper";

export const useCreateJobPosition = () => {
  const [loading, setLoading] = useState(false);

  const createPosition = async (payload) => {
    try {
      setLoading(true);

      const dto = mapAddPositionToCreateDto(payload);

      const res = await jobPositionApiService.createPosition({
        dto,
        indentFile: payload.indentFile,
      });
      console.log("Final Create position response:", res);

      if (!res?.success) {
        throw new Error(res?.message || "Create position failed");
      }

      return res.data; // success path ONLY
    } catch (err) {
      console.error("Create position failed", err);
      throw err; // 🔥 THIS IS THE FIX
    } finally {
      setLoading(false);
    }
  };

  return { createPosition, loading };
};
