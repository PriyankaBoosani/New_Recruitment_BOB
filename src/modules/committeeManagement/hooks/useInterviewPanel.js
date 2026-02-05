import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import masterApiService from "../../master/services/masterApiService";
import committeeManagementService from "../services/committeeManagementService";
import { mapInterviewMembersApi } from "../mappers/interviewMembersMapper";
import {
  mapInterviewPanelsApiToUI,
  mapPanelToFormData,
  preparePanelPayload
} from "../mappers/InterviewPanelMapper";

export const useInterviewPanel = () => {
  const [panels, setPanels] = useState([]);
  const [communityOptions, setCommunityOptions] = useState([]);
  const [membersOptions, setMembersOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    community: "",
    members: []
  });

  const [errors, setErrors] = useState({});

  /* ================= PAGINATION ================= */

  const [page, setPage] = useState(0);
 const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);


  /* ================= search ================= */
  const [search, setSearch] = useState({
    panelName: "",
    committeeName: "",
    panelMemberName: ""
  });
  const [showFilters, setShowFilters] = useState(true);


  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc"
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc"
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedPanels = useMemo(() => {
    if (!sortConfig.key) return panels;

    return [...panels].sort((a, b) => {
      const aVal = a[sortConfig.key]?.toString().toLowerCase();
      const bVal = b[sortConfig.key]?.toString().toLowerCase();

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [panels, sortConfig]);

  /* ================= FETCH PANELS ================= */
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setPage(0);      // reset to first page
  //     fetchPanels();
  //   }, 400);           // debounce

  //   return () => clearTimeout(timer);
  // }, [search.panelName]);



  useEffect(() => {
    const panelNameValue = search.panelName?.trim();
    const committeeNameValue = search.committeeName?.trim();

    console.log("panelNameValue", panelNameValue);
    console.log("committeeNameValue", committeeNameValue);

    // 🔴 If both empty → load all data
    if (!panelNameValue && !committeeNameValue) {
      setPage(0);
      fetchPanels();
      return;
    }

    // 🟡 If panelName has less than 2 chars and no committee selected → do nothing
    if (panelNameValue && panelNameValue.length < 2 && !committeeNameValue) return;

    const timer = setTimeout(() => {
      setPage(0);
      fetchPanels();
    }, 400);

    return () => clearTimeout(timer);
  }, [search.panelName, search.committeeName]);


useEffect(() => {
  setPage(0);
}, [size]);



  const fetchPanels = useCallback(async () => {
    try {
      setLoading(true);

      // 👉 Pagination only (NO filters)
      const res = await masterApiService.getInterviewPanelsSearch({
        page,
        size,
        panelName: search.panelName,
        committeeName: search.committeeName

      });

      console.log("fetchpanels", res);

      const data = res?.data;

      setPanels(mapInterviewPanelsApiToUI(data?.content || []));
      setTotalPages(data?.totalPages || 0);

    } catch (err) {
      console.error("Fetch Panels Error:", err);
      toast.error("Failed to load panels");
    } finally {
      setLoading(false);
    }
  }, [page, size, search]);

  /* ================= INIT DATA ================= */

  const initData = useCallback(async () => {
    try {
      setLoading(true);

      const [commRes, memRes] = await Promise.all([
        masterApiService.getMasterDropdownData(),
        committeeManagementService.getAllusers()
      ]);

      setCommunityOptions(
        (commRes?.data || []).map(c => ({
          id: c.interviewCommitteeId,
          name: c.committeeName
        }))
      );

      setMembersOptions(mapInterviewMembersApi(memRes));

    } catch (error) {
      console.error("Init Data Error:", error);
      toast.error("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= VALIDATION ================= */

  const validatePanelForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Panel name is required";
    }
    // else if (formData.name.trim().length < 3) {
    //   newErrors.name = "Panel name must be at least 3 characters";
    // }

    if (!formData.community) {
      newErrors.community = "Panel type is required";
    }

    if (!formData.members || formData.members.length === 0) {
      newErrors.members = "Select at least one panel member";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!validatePanelForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    const payload = preparePanelPayload(
      formData,
      communityOptions,
      membersOptions
    );

    try {
      if (formData.id) {
        // ✅ UPDATE
        await masterApiService.updateInterviewPanel(
          formData.id,
          payload
        );

        toast.success("Panel updated successfully");
      } else {
        // ✅ CREATE
        const res = await masterApiService.addInterviewPanel(payload);
        if (res?.success) {
          toast.success("Panel created successfully");
        }
      }

      fetchPanels();
      setFormData({
        name: "",
        community: "",
        members: []
      });
      setErrors({});

    } catch (err) {
      console.error("SAVE ERROR 👉", err);
      toast.error(
        err?.response?.data?.message ||
        "Failed to save panel"
      );
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = useCallback(async (id) => {
    try {
      await masterApiService.deleteInterviewPanel(id);
      toast.success("Panel deleted successfully");
      fetchPanels();
    } catch (err) {
      console.error("DELETE ERROR 👉", err);
      toast.error(
        err?.response?.data?.message ||
        "Failed to delete panel"
      );
    }
  }, [fetchPanels]);

  /* ================= EDIT ================= */

  const handleEdit = async (panelId) => {
    try {
      const res = await masterApiService.getInterviewPanelById(panelId);
      const mappedForm = mapPanelToFormData(res?.data);
      console.log("mappedForm", mappedForm)
      setFormData(mappedForm);
    } catch (err) {
      toast.error("Failed to load panel details");
    }
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    initData();
  }, [initData]);

useEffect(() => {
  fetchPanels();
}, [page, size]);

  // useEffect(() => {
  //   fetchPanels();
  // }, [fetchPanels]);

  console.log("formData", formData);
  console.log("membersOptions", membersOptions);

  /* ================= RETURN ================= */

  return {
    panels,
    loading,

    communityOptions,
    membersOptions,

    formData,
    setFormData,

    errors,
    setErrors,
    clearError,

    handleSave,
    handleDelete,
    handleEdit,
    initData,

    page,
    setPage,
    totalPages,
     size,
    setSize,

    search,
     
    setSearch,

    setShowFilters,
    showFilters,

    sortConfig,
    handleSort,
    sortedPanels

  };
};
