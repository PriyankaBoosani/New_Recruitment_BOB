// src/modules/jobPostings/hooks/useJobRequisitions.js

import { useEffect, useState } from "react";
import requisitionApiService from "../services/requisitionApiService";
import { mapJobRequisitionFromApi } from "../mappers/jobReqDetailsMapper";
import { toast } from "react-toastify";

export const useJobRequisitions = ({
  year,
  status,
  search,
  page = 0,
  size = 0
}) => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(null);
  

  const fetchRequisitions = async () => {
    try {
      setLoading(true);

      const res = await requisitionApiService.getJobRequisitions({
        year,
        status,
        search,
        page,
        size
      });

      const content = res?.data?.content || [];
      console.log(content);

      setRequisitions(content.map(mapJobRequisitionFromApi));
      setPageInfo(res.data.page);
    } catch (err) {
      toast.error("Failed to fetch requisitions");
    } finally {
      setLoading(false);
    }
  };
  const deleteRequisition = async (id) => {
    try {
      await requisitionApiService.deleteRequisition(id);
      toast.success("Requisition deleted successfully");
      fetchRequisitions(); // refresh list
    } catch {
      toast.error("Failed to delete requisition");
    }
  };
  const submitForApproval = async (jobRequisitionIds) => {
    if (!jobRequisitionIds?.length) return;

    try {
      setLoading(true);

      await requisitionApiService.submitForApproval({
        jobRequisitionIds,
        postingStatus: "Approved" // confirm backend enum
        
      });

      toast.success("Requisition(s) submitted for approval");
      fetchRequisitions(); // refresh list
    } catch (err) {
      toast.error("Failed to submit for approval");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRequisitions();
  }, [year, status, search, page, size]);

  return {
    requisitions,
    loading,
    pageInfo,
    deleteRequisition,
    submitForApproval,
    refetch: fetchRequisitions
  };
};
