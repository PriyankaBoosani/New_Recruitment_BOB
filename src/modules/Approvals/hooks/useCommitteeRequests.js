import { useState } from "react";
import committeeManagementService from "../../committeeManagement/services/committeeManagementService";
import { toast } from "react-toastify";

const useCommitteeRequests = () => {

    const [requisitionOptions, setRequisitionOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);
    const [panelData, setPanelData] = useState({
        interviewPanelList: [],
        screeningPanelList: [],
        compensationPanelList: []
    });

    const [loadingRequisitions, setLoadingRequisitions] = useState(false);
    const [loadingPositions, setLoadingPositions] = useState(false);
    const [loadingPanels, setLoadingPanels] = useState(false);

    const fetchRequisitions = async () => {
        try {
            setLoadingRequisitions(true);

            const res = await committeeManagementService.getRequisitions();
            const data = res?.data || [];

            const mapped = data.map(req => ({
                label: `${req.requisitionCode} - ${req.requisitionTitle}`,
                value: req.id,
                raw: {
                    id: req.id,
                    requisitionCode: req.requisitionCode,
                    requisitionTitle: req.requisitionTitle
                }
            }));

            setRequisitionOptions(mapped);

        } catch {
            toast.error("Failed to load requisitions");
        } finally {
            setLoadingRequisitions(false);
        }
    };

    const fetchPositions = async (reqId) => {
        try {
            setLoadingPositions(true);

            const res = await committeeManagementService.getPositionsByRequisition(reqId);
            const data = res?.data || [];

            const mapped = data.map(item => ({
                label: item.masterPositions?.positionName,
                value: item.jobPositions?.positionId,
                raw: {
                    ...item.jobPositions,
                    ...item.masterPositions
                }
            }));

            setPositionOptions(mapped);

        } catch {
            toast.error("Failed to load positions");
        } finally {
            setLoadingPositions(false);
        }
    };

    const fetchPanels = async (positionId) => {
        try {
            setLoadingPanels(true);

            const res = await committeeManagementService.getPanelsByPosition(positionId);
            const data = res?.data || {};

            setPanelData({
                interviewPanelList: data.interviewPanelList || [],
                screeningPanelList: data.screeningPanelList || [],
                compensationPanelList: data.compensationPanelList || []
            });

        } catch {
            toast.error("Failed to load panels");
        } finally {
            setLoadingPanels(false);
        }
    };

    const clearPanels = () => {
        setPanelData({
            interviewPanelList: [],
            screeningPanelList: [],
            compensationPanelList: []
        });
    };
    const approveOrRejectPanels = async (ids, type, comment) => {
        try {

            for (const id of ids) {

                await committeeManagementService.approveOrRejectCommittee(id, {
                    status: type === "approve" ? "APPROVED" : "REJECTED",
                    comments: comment
                });

            }

            toast.success(`Panels ${type}d successfully`);
            return true;

        } catch (error) {

            toast.error(error.response?.data?.message || "Approval failed");
            return false;

        }
    };

    return {
        requisitionOptions,
        positionOptions,
        panelData,

        loadingRequisitions,
        loadingPositions,
        loadingPanels,

        fetchRequisitions,
        fetchPositions,
        fetchPanels,
        clearPanels,
        setPositionOptions,
        approveOrRejectPanels
    };
};

export default useCommitteeRequests;