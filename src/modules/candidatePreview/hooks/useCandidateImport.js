import {
  useState
} from "react";

import {
  toast
} from "react-toastify";

import candidateWorkflowServices
from "../services/CandidateWorkflowServices";

export const useCandidateImport =
  () => {

    const [loading, setLoading] =
      useState(false);

    /* =========================
       BULK IMPORT
    ========================== */

    const bulkImportCandidates =
      async (file) => {

        setLoading(true);

        try {

          const res =
            await candidateWorkflowServices
              .bulkImportCandidates(
                file
              );

          if (
            res.success === false
          ) {

            return {
              success: false,
              error:
                res.message,
              details:
                res.data || []
            };

          }

          toast.success(
            res.message ||
            "Candidates imported successfully"
          );

          return {
            success: true
          };

    } catch (err) {

  console.error(
    "IMPORT ERROR",
    err
  );

  const message =

    err?.response?.data?.message ||

    err?.message ||

    "Failed to import candidates";

  const details =

    err?.response?.data?.data || [];

  toast.error(message);

  return {

    success: false,

    error: message,

    details: Array.isArray(details)
      ? details
      : []

  };

} finally {

          setLoading(false);

        }

      };

    /* =========================
       DOWNLOAD TEMPLATE
    ========================== */

const downloadCandidateTemplate =
  async (positionIds = []) => {

        try {

          const res =
            await candidateWorkflowServices
              .downloadCandidateTemplate( positionIds);

          const blob =
            res.data;

          const url =
            window.URL.createObjectURL(
              blob
            );

          const link =
            document.createElement(
              "a"
            );

          link.href = url;

          link.download =
            "Candidate_Template.xlsx";

          document.body.appendChild(
            link
          );

          link.click();

          document.body.removeChild(
            link
          );

          window.URL.revokeObjectURL(
            url
          );

        } catch (err) {

          console.error(
            "Download failed:",
            err
          );

          toast.error(
            "Failed to download template"
          );

        }

      };

    return {

      loading,

      bulkImportCandidates,

      downloadCandidateTemplate

    };

  };