import { useState } from "react";
import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";

export const useRequisitionApprovalHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistory = async (requisitionId) => {
        try {
            setLoading(true);

            const res =
                await jobPositionApiService.getRequisitionApprovalHistory(
                    requisitionId
                );

            console.log("FULL RESPONSE:", res);
            console.log("RESPONSE DATA:", res?.data);

            setHistory(res?.data || []);

        } catch (err) {
            console.error("History fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        history,
        loading,
        error,
        fetchHistory,
    };
};