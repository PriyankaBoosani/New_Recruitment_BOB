import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
import { useEffect, useState } from "react";
import { mapApprovalRequisition } from "../mapper/mapApprovalRequisition";

export const useApprovalRequisitions = ({
    year,
    role,
    search,
    page,
    size,
    statuses
}) => {
    const [requisitions, setRequisitions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState(null);

    const fetchRequisitions = async () => {
        try {
            setLoading(true);

            const response =
                await jobPositionApiService.getL1Requisitions({
                    year,
                    search,
                    page,
                    size,
                    statuses
                });

            const data = response?.data;

            const mapped = (data?.content || []).map(mapApprovalRequisition);
            setRequisitions(mapped); setPageInfo(data?.page || null);
        } catch (error) {
            console.error("Error fetching requisitions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!role) return;
        fetchRequisitions();
    }, [year, role, search, page, size, statuses]);

    const approve = async (ids, comment) => {
        const response = await jobPositionApiService.approveRequisitions({
            ids,
            postingStatus: role === "L1" ? "L1_APPROVED" : "APPROVED",
            comments: comment
        });

        await fetchRequisitions();

        return response;   // 🔥 THIS IS CRITICAL
        
    };

    const reject = async (ids, comment) => {
        const response = await jobPositionApiService.approveRequisitions({
            ids,
            postingStatus: role === "L1" ? "L1_REJECTED" : "L2_REJECTED",
            comments: comment
        });

        await fetchRequisitions();

        return response;   // 🔥 THIS IS CRITICAL
    };

    return {
        requisitions,
        loading,
        pageInfo,
        approve,
        reject
    };
};