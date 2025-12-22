import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import masterApiService from "../../../services/masterApiService";
import {
  mapCategoriesFromApi,
  mapCategoryToApi
} from "../mappers/categoryMapper";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  /* ================= FETCH ================= */
const fetchCategories = async () => {
  try {
    const res = await masterApiService.getAllCategories();

    const list = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    const mapped = mapCategoriesFromApi(list);

    // ✅ ALWAYS SHOW NEWLY ADDED ITEMS ON TOP
    setCategories([...mapped].reverse());

  } catch (error) {
    toast.error("Failed to load categories");
    setCategories([]);
  }
};


  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= ADD ================= */
  const addCategory = async (payload) => {
    try {
      const res = await masterApiService.addCategory(
        mapCategoryToApi(payload)
      );

      toast.success("Category added successfully");

      // ✅ BUILD UI ITEM FROM API RESPONSE
      const newItem = {
        id: res?.data?.data?.reservationCategoriesId,
        code: payload.code,
        name: payload.name,
        description: payload.description,
        createdDate: new Date().toISOString()
      };

      // ✅ ADD TO TOP INSTANTLY
      setCategories(prev => [newItem, ...prev]);

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to add category"
      );
    }
  };

  /* ================= UPDATE ================= */
  const updateCategory = async (id, payload) => {
    try {
      await masterApiService.updateCategory(
        id,
        mapCategoryToApi(payload)
      );

      toast.success("Category updated successfully");

      // refetch keeps correct order
      fetchCategories();

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to update category"
      );
    }
  };

  /* ================= DELETE ================= */
  const deleteCategory = async (id) => {
    try {
      await masterApiService.deleteCategory(id);

      toast.success("Category deleted successfully");

      // ✅ INSTANT UI UPDATE
      setCategories(prev => prev.filter(c => c.id !== id));

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to delete category"
      );
    }
  };

  /* ================= IMPORT ================= */
  const importCategories = async (args) => {
    console.warn("Import API not integrated yet", args);
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    importCategories
  };
};
