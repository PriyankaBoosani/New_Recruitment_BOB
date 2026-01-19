import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import masterApiService from "../../../services/masterApiService";
import { mapUsersFromApi, mapUserToApi } from "../mappers/userMapper";

export const useUsers = () => {
  const { t } = useTranslation(["user"]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await masterApiService.getRegister();
      const list = mapUsersFromApi(res || []);

      // Newest first (highest id on top)
      list.sort((a, b) => Number(b.id) - Number(a.id));

      setUsers(list);
    } catch (err) {
      console.error("User fetch failed", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (payload) => {
    try {
      await masterApiService.registerUser(
        mapUserToApi(payload)
      );

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




  const deleteUser = async (id) => {
    await masterApiService.deleteUser(id);
    await fetchUsers();
    toast.success(t("delete_success"));
  };

  return {
    users,
    loading,
    fetchUsers,
    addUser,
    deleteUser
  };
};
