// src/modules/master/pages/Document/hooks/useDocuments.js

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import masterApiService from '../../../services/masterApiService';
import { mapDocumentsFromApi } from '../mappers/documentMapper';
import { useTranslation } from 'react-i18next';

export const useDocuments = () => {
    const { t } = useTranslation(["documents", "validation"]);

  const [documents, setDocuments] = useState([]);
 const [loading, setLoading] = useState(false);
const fetchDocuments = async () => {
  const res = await masterApiService.getAllDocumentTypes();
  const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

  // 🔥 Sort newest first
  const sorted = [...list].sort((a, b) => {
    const da = new Date(a.createdDate || 0).getTime();
    const db = new Date(b.createdDate || 0).getTime();
    return db - da;
  });

  setDocuments(mapDocumentsFromApi(sorted));
};
const bulkAddDocuments = async (file) => {
     setLoading(true);
      try {
        const res = await masterApiService.bulkAddDocuments(file);

        console.log("API RESPONSE:", res); // logs for 200 & 422

      // ❌ business failure
      if (res.success === false) {
        toast.error(res.message);
        return {
          success: false,
          error: res.message
        };
      }
      // ✅ success
      toast.success(res.message || "File uploaded successfully");

      return {
        success: true
      };

    } catch (err) {
      // ❌ network / server error
      console.log("NETWORK ERROR:", err);

      const message = "Something went wrong";
      toast.error(message);

      return {
        success: false,
        error: message
      };

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const addDocument = async (payload) => {
    await masterApiService.addDocumentType(payload);
    await fetchDocuments();
    toast.success(t("documents:document_added_successfully"));
  };

  const updateDocument = async (id, payload) => {
    await masterApiService.updateDocumentType(id, payload);
    await fetchDocuments();
    toast.success(t("documents:document_updated_successfully"));
  };

  const deleteDocument = async (id) => {
    await masterApiService.deleteDocumentType(id);
    await fetchDocuments();
    toast.success(t("documents:document_deleted_successfully"));
  };

  return {
    documents,
    fetchDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    bulkAddDocuments
  };
};
