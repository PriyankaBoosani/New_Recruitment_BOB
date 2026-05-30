import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import masterApiService from "../../../services/masterApiService";
import { mapUsersFromApi } from "../mappers/userMapper";

export const useUsers = () => {
  const { t } = useTranslation(["user"]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interviewCentres, setInterviewCentres] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await masterApiService.getRegister();
      const list = mapUsersFromApi(res.data || []);

      // Newest first (highest id on top)
      //list.sort((a, b) => Number(b.id) - Number(a.id));

      setUsers(list);
    } catch (err) {
      console.error("User fetch failed", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInteviewCentres = async () => {
    setLoading(true);
    try {
      const res = await masterApiService.getAllInterviewCenters();
      if (res?.data) {
        const zonalOfficeCentres = res.data.filter(
          (c) => c.organizationType === "Zonal Office"
        );

        setInterviewCentres(zonalOfficeCentres);
        console.log("test", zonalOfficeCentres);
      }

      // const centres = res?.data || [];

      // setInterviewCentres(centres);
    } catch (err) {
      console.error("Interview centres fetch failed", err);
      setInterviewCentres([]);
    } finally {
      setLoading(false);
    }
  };

  // const fetchRoles = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await masterApiService.getRoles();

  //     const roles = res?.data || [];

  //     setRoles(roles);
  //   } catch (err) {
  //     console.error("Roles fetch failed", err);
  //     setRoles([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    fetchUsers();
    fetchInteviewCentres();
  }, []);

  const addUser = async (payload) => {
    const payloadData = {
      role: payload.role,
      name: payload.fullName,
      email: payload.email,
      interviewCenterId: payload.interviewCenterId,
    };

    try {
      await masterApiService.saveUser(payloadData);

      toast.success(t("add_success"));
      await fetchUsers();
    } catch (err) {
      // Axios ALWAYS puts response here
      const status = err.response?.status;

      if (status === 409) {
        toast.error("User already exists");
      } else {
        toast.error("Failed to add user");
      }

      // optional but good practice
      console.error("Add user failed:", err);
    }
  };

  // const deleteUser = async (id) => {
  //   await masterApiService.deleteUser(id);
  //   await fetchUsers();
  //   toast.success(t("delete_success"));
  // };

  const deleteUser = async (id) => {
    try {
      await masterApiService.deleteUser(id);
      await fetchUsers();
      toast.success(t("delete_success"));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("delete_error"));
    }
  };

  // ================= BULK UPLOAD =================

  const bulkAddUsers = async (file) => {
    setLoading(true);
    try {
      const res = await masterApiService.bulkAddUsers(file);
      //  business failure
      if (res.success === false) {
        // toast.error(res.message);
        return {
          success: false,
          error: res.message,
          details: res.data || [],
        };
      }
      // success
      toast.success(res.message || "File uploaded successfully");
      fetchUsers();

      return {
        success: true,
      };
    } catch (err) {
      //  network / server error

      const message = "Something went wrong";
      toast.error(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };
  // ================= DOWNLOAD TEMPLATE =================
  const downloadUserTemplate = async () => {
    try {
      const res = await masterApiService.downloadUserTemplate();

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "User_Template.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Template download failed");
    }
  };

  const updateUser = async (id, payload) => {
    try {
      const payloadData = {
        role: payload.role,
        name: payload.fullName,
        email: payload.email,
        interviewCenterId: payload.interviewCenterId,
      };
      //console.log("payload",payloadData);return false;
      await masterApiService.updateUser(id, payloadData);

      toast.success(t("update_success"));
      await fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
      console.error("Update failed:", err);
    }
  };
  return {
    users,
    loading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    interviewCentres,
    bulkAddUsers,
    downloadUserTemplate,
  };
};
