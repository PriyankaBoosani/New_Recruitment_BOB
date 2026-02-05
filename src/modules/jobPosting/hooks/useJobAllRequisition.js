// src/modules/jobPostings/hooks/useJobRequisitions.js

import { useEffect, useState } from "react";
import requisitionApiService from "../services/requisitionApiService";
import { mapJobRequisitionFromApi } from "../mappers/jobReqDetailsMapper";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


export const useJobRequisitions = ({
  year,
  status,
  search,
  page = 0,
  size = 0
}) => {
   const { t } = useTranslation("jobPostingsList");
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
      toast.error(t("requisitions_fetch_failed"));
    } finally {
      setLoading(false);
    }
  };
  const deleteRequisition = async (id) => {
    try {
      await requisitionApiService.deleteRequisition(id);
      toast.success(t("requisition_delete_success"));
      fetchRequisitions(); // refresh list
    } catch {
      toast.error(t("requisition_delete_failed"));
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

      toast.success(t("requisition_approve_success"));
      fetchRequisitions(); // refresh list
    } catch (err) {
      toast.error(t("requisition_approve_failed"));
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
