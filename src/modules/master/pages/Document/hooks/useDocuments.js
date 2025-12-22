// src/modules/master/pages/Document/hooks/useDocuments.js

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import masterApiService from '../../../services/masterApiService';
import { mapDocumentsFromApi } from '../mappers/documentMapper';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);

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


  useEffect(() => {
    fetchDocuments();
  }, []);

  const addDocument = async (payload) => {
    await masterApiService.addDocumentType(payload);
    await fetchDocuments();
    toast.success("Document added successfully");
  };

  const updateDocument = async (id, payload) => {
    await masterApiService.updateDocumentType(id, payload);
    await fetchDocuments();
    toast.success("Document updated successfully");
  };

  const deleteDocument = async (id) => {
    await masterApiService.deleteDocumentType(id);
    await fetchDocuments();
    toast.success("Document deleted successfully");
  };

  return {
    documents,
    fetchDocuments,
    addDocument,
    updateDocument,
    deleteDocument
  };
};
