import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import masterApiService from "../../../services/masterApiService";
import {
  mapInterviewPanelsFromApi,
  mapInterviewPanelToApi
} from "../mappers/interviewPanelMapper";

export const useInterviewPanels = () => {
  const { t } = useTranslation(["interviewPanel", "validation"]);

  const [panels, setPanels] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Interview Panels
  const fetchInterviewPanels = async () => {
    try {
      setLoading(true);

      const res = await masterApiService.getInterviewPanels();

      const apiList = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      const mapped = mapInterviewPanelsFromApi(apiList);

      // 🔽 newest first (same as Department)
      mapped.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );

      setPanels(mapped);
    } catch (err) {
      console.error("InterviewPanel fetch failed", err);
      setPanels([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Active Members
  const fetchActiveMembers = async () => {
    try {
      const res = await masterApiService.getActiveInterviewMembers();
      const apiList = res?.data?.data || [];
      setMembers(apiList);
    } catch (err) {
      console.error("Active members fetch failed", err);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchInterviewPanels();
    fetchActiveMembers();
  }, []);

  // 🔹 Add Panel
  const addPanel = async (payload) => {
    try {
      await masterApiService.addInterviewPanel(
        mapInterviewPanelToApi(payload)
      );
      await fetchInterviewPanels();
      toast.success(t("interviewPanel:add_success") || "Panel added successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          t("interviewPanel:add_error") ||
          "Failed to add panel"
      );
    }
  };

  // 🔹 Update Panel
  const updatePanel = async (id, payload) => {
    try {
      await masterApiService.updateInterviewPanel(
        id,
        mapInterviewPanelToApi(payload)
      );
      await fetchInterviewPanels();
      toast.success(
        t("interviewPanel:update_success") || "Panel updated successfully"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          t("interviewPanel:update_error") ||
          "Failed to update panel"
      );
    }
  };

  // 🔹 Delete Panel
  const deletePanel = async (id) => {
    try {
      await masterApiService.deleteInterviewPanel(id);
      await fetchInterviewPanels();
      toast.success(
        t("interviewPanel:delete_success") || "Panel deleted successfully"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          t("interviewPanel:delete_error") ||
          "Failed to delete panel"
      );
    }
  };

  return {
    panels,
    members,
    loading,
    fetchInterviewPanels,
    addPanel,
    updatePanel,
    deletePanel
  };
};
