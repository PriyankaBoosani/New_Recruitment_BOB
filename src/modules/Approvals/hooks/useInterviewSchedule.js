import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import committeeManagementService from "../../committeeManagement/services/committeeManagementService";
import masterApiService from "../../master/services/masterApiService";

const useInterviewSchedule = () => {
    const [requisitionOptions, setRequisitionOptions] = useState([]);
    const [loadingRequisitions, setLoadingRequisitions] = useState(false);

    const [positionDetails, setPositionDetails] = useState([]);
    const [loadingPositionDetails, setLoadingPositionDetails] = useState(false);

    const [masterPositions, setMasterPositions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loadingMasters, setLoadingMasters] = useState(false);
    const [loadingL1Approval, setLoadingL1Approval] = useState(false);

    const fetchMasters = useCallback(async () => {
        try {
            setLoadingMasters(true);

            const res = await masterApiService.getAllMasters();
            const data = res?.data?.data || res?.data || {};

            setMasterPositions(Array.isArray(data?.masterPositions) ? data.masterPositions : []);
            setDepartments(Array.isArray(data?.departments) ? data.departments : []);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load masters");
            setMasterPositions([]);
            setDepartments([]);
        } finally {
            setLoadingMasters(false);
        }
    }, []);

    const fetchRequisitions = useCallback(async () => {
        try {
            setLoadingRequisitions(true);

            const res = await committeeManagementService.getRequisitions();
            const data = res?.data?.data || res?.data?.content || res?.data || [];

            setRequisitionOptions(
                data.map((req) => ({
                    label: `${req.requisitionCode} - ${req.requisitionTitle}`,
                    value: req.id,
                    raw: req,
                }))
            );
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load requisitions");
            setRequisitionOptions([]);
        } finally {
            setLoadingRequisitions(false);
        }
    }, []);

    const getPositionNameFromMaster = useCallback(
        (jobPositionDTO) => {
            const masterPositionId =
                jobPositionDTO?.masterPositionId || jobPositionDTO?.positionId;

            const found = masterPositions.find(
                (m) =>
                    m.masterPositionsId === masterPositionId ||
                    m.positionId === masterPositionId ||
                    m.id === masterPositionId
            );

            return found?.positionName || "-";
        },
        [masterPositions]
    );

    const getDepartmentNameFromMaster = useCallback(
        (jobPositionDTO) => {
            const deptId = jobPositionDTO?.deptId;

            const found = departments.find(
                (d) =>
                    d.departmentId === deptId ||
                    d.deptId === deptId ||
                    d.id === deptId
            );

            return found?.departmentName || "-";
        },
        [departments]
    );

    const fetchPositionDetailsByRequisition = useCallback(
        async (requisitionId) => {
            if (!requisitionId) {
                setPositionDetails([]);
                return;
            }

            try {
                setLoadingPositionDetails(true);

                const res =
                    await committeeManagementService.getPositionDetailsInterviewApproval(
                        requisitionId
                    );

                const data = res?.data?.data || res?.data || [];

                const mapped = Array.isArray(data)
                    ? data.map((item, index) => {
                        const job = item?.jobPositionsDTO || {};

                        return {
                            positionId: job?.positionId || job?.masterPositionId || index,
                            positionName: getPositionNameFromMaster(job),
                            departmentName: getDepartmentNameFromMaster(job),
                            totalCandidateCount: item?.totalCandidateCount || 0,
                            totalZonalCount: item?.totalZonalCount || 0,
                            totalPanelCount: item?.totalPanelCount || 0,
                            zonalData: item?.zonalData || [],
                            panelData: item?.panelData || [],
                            raw: item,
                        };
                    })
                    : [];

                setPositionDetails(mapped);
            } catch (error) {
                toast.error(
                    error?.response?.data?.message || "Failed to load position details"
                );
                setPositionDetails([]);
            } finally {
                setLoadingPositionDetails(false);
            }
        },
        [getDepartmentNameFromMaster, getPositionNameFromMaster]
    );
    const submitL1Approval = useCallback(async (positionIds) => {
        if (!positionIds || positionIds.length === 0) return;

        try {
            setLoadingL1Approval(true);

            const payload = {
                positionIds,
                status: "L1_PENDING",
            };

            const res = await committeeManagementService.submitL1Approval(payload);

            toast.success(res?.data?.message || "L1 approval submitted successfully");
            return res;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to submit L1 approval"
            );
            throw error;
        } finally {
            setLoadingL1Approval(false);
        }
    }, []);

    useEffect(() => {
        fetchMasters();
    }, [fetchMasters]);

    return {
        requisitionOptions,
        loadingRequisitions,
        fetchRequisitions,
        positionDetails,
        loadingPositionDetails,
        fetchPositionDetailsByRequisition,
        loadingMasters,
        submitL1Approval,
        loadingL1Approval
    };
};

export default useInterviewSchedule;