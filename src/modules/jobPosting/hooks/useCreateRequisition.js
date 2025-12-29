// src/modules/jobPostings/hooks/useCreateRequisition.js
import { useState } from "react";
import requisitionApiService from "../services/requisitionApiService";

export const useCreateRequisition = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createRequisition = async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await requisitionApiService.createRequisition(payload);
            return response.data;
        } catch (err) {
            setError(
                err?.response?.data?.message || "Failed to create requisition"
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createRequisition,
        loading,
        error,
    };
};
