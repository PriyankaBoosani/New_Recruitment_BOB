import jobPositionApiService from "../../jobPosting/services/jobPositionApiService";
import { useEffect, useState } from "react";
import { mapApprovalRequisition } from "../mapper/mapApprovalRequisition";

import { useSelector } from "react-redux";

export const useApprovalRequisitions = ({ year, search, page, size, statuses }) => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(null);

  const privileges = useSelector((state) => state.user.privileges);

  const isL1 = privileges?.["L1 Approval"];
  const isL2 = privileges?.["L2 Approval"];

  const approvalLevel = isL2 ? "L2" : isL1 ? "L1" : null;

  const fetchRequisitions = async () => {
    try {
      setLoading(true);

      let response;

      if (approvalLevel === "L1") {
        response = await jobPositionApiService.getL1Requisitions({
          year,
          search,
          page,
          size,
          statuses,
        });
      } else if (approvalLevel === "L2") {
        response = await jobPositionApiService.getL2Requisitions({
          year,
          search,
          page,
          size,
          statuses,
        });
      } else {
        return;
      }

      const data = response?.data;
      const mapped = (data?.content || []).map(mapApprovalRequisition);

      setRequisitions(mapped);
      setPageInfo(data?.page || null);
    } catch (error) {
      console.error("Error fetching requisitions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!approvalLevel) return;
    fetchRequisitions();
  }, [year, approvalLevel, search, page, size, statuses]);

  const approve = async (ids, comment) => {
    const response = await jobPositionApiService.approveRequisitions({
      ids,
      postingStatus: approvalLevel === "L1" ? "L1_APPROVED" : "APPROVED",
      comments: comment,
    });

    await fetchRequisitions();
    return response;
  };

  const reject = async (ids, comment) => {
    const response = await jobPositionApiService.approveRequisitions({
      ids,
      postingStatus: approvalLevel === "L1" ? "L1_REJECTED" : "L2_REJECTED",
      comments: comment,
    });

    await fetchRequisitions();
    return response;
  };

  return {
    requisitions,
    loading,
    pageInfo,
    approve,
    reject,
  };
};
