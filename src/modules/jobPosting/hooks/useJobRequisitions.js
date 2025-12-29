// src/modules/jobPostings/hooks/useJobRequisitions.js

import { useEffect, useState } from "react";
import requisitionApiService from "../services/requisitionApiService";
import { mapJobRequisitionFromApi } from "../mappers/jobRequisitionMapper";
import { toast } from "react-toastify";

export const useJobRequisitions = ({
  year,
  status,
  search,
  page = 0,
  size = 10
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

  useEffect(() => {
    fetchRequisitions();
  }, [year, status, search, page, size]);

  return {
    requisitions,
    loading,
    pageInfo,
    deleteRequisition,
    refetch: fetchRequisitions
  };
};
