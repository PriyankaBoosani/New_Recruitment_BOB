import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import committeeManagementService from "../../committeeManagement/services/committeeManagementService";

const useExamRequest = () => {
    const [requisitionOptions, setRequisitionOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);

    const [loadingRequisitions, setLoadingRequisitions] = useState(false);
    const [loadingPositions, setLoadingPositions] = useState(false);

    const fetchRequisitions = useCallback(async () => {
        try {
            setLoadingRequisitions(true);
            const res = await committeeManagementService.getRequisitions();
            const data = res?.data || [];

            setRequisitionOptions(
                data.map((req) => ({
                    label: `${req.requisitionCode} - ${req.requisitionTitle}`,
                    value: req.id,
                    raw: req,
                }))
            );
        } catch (error) {
            toast.error("Failed to load requisitions");
            setRequisitionOptions([]);
        } finally {
            setLoadingRequisitions(false);
        }
    }, []);

    const fetchPositions = useCallback(async (reqId) => {
        try {
            setLoadingPositions(true);
            const res = await committeeManagementService.getPositionsByRequisition(reqId);
            const data = res?.data || [];

            const mapped = data.map((item) => ({
                label: item.masterPositions?.positionName || "-",
                value: item.jobPositions?.positionId,
                raw: {
                    ...item.jobPositions,
                    ...item.masterPositions,
                },
            }));

            setPositionOptions(mapped);
            return mapped;
        } catch {
            toast.error("Failed to load positions");
            setPositionOptions([]);
            return [];
        } finally {
            setLoadingPositions(false);
        }
    }, []);

    return {
        requisitionOptions,
        positionOptions,
        loadingRequisitions,
        loadingPositions,
        fetchRequisitions,
        fetchPositions,
        setPositionOptions,
    };
};

export default useExamRequest;