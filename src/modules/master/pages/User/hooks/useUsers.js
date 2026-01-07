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
  // 1️⃣ Call API
  const res = await masterApiService.registerUser(mapUserToApi(payload));

  // 2️⃣ Create UI user object immediately
  const newUser = {
    id: res?.id || Date.now(), // fallback if API doesn’t return id
    role: payload.role,
    name: payload.fullName,
    email: payload.email,
  };

  // 3️⃣ Put NEW USER AT TOP immediately
  setUsers(prev => [newUser, ...prev]);

  // 4️⃣ Re-sync from backend (keeps order stable)
  await fetchUsers();

  toast.success(t("add_success"));
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
