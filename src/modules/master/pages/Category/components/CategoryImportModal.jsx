import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Upload as UploadIcon } from 'react-bootstrap-icons';
import { useTranslation } from "react-i18next";

import { useCategories } from '../hooks/useCategories';

const CategoryImportModal = ({
  onClose = () => {},
  onSuccess = () => {}
}) => {
  const { t } = useTranslation(["category"]);
  const { bulkAddCategories, downloadCategoryTemplate, loading } = useCategories();

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const isExcel = file && (
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel'
    );

    if (isExcel) {
      setSelectedFile(file);
      setError('');
    } else {
      setError(t("category:invalid_file"));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("category:no_file_selected"));
      return;
    }

    const result = await bulkAddCategories(selectedFile);

    if (result?.success) {
      onSuccess();
      onClose();
    } else {
      setError(result?.error || t("category:import_error"));
    }
  };

  return (
    <div>
      <div className="import-area p-4 rounded" style={{ background: '#fceee9' }}>
        <div className="text-center mb-3">
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              marginBottom: '1rem'
            }}
          >
            <UploadIcon size={32} />
          </div>

          <h5 className="mb-2 uploadfile">
            {t("category:upload_categories")}
          </h5>

          <p className="text-muted small">
            {t("category:support_xlsx")}
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <input
          id="upload-xlsx-cat"
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={handleFileChange}
          disabled={loading}
        />

        <div className="text-center mb-3">
          <label htmlFor="upload-xlsx-cat">
            <Button
              variant="primary"
              as="span"
              className="btnupload"
              disabled={loading}
            >
              {selectedFile
                ? t("category:reupload_xlsx")
                : t("category:upload_xlsx")}
            </Button>
          </label>

          {selectedFile && (
            <div className="mt-2">
              <small className="text-muted d-block">
                {selectedFile.name}
              </small>
              <Button
                variant="outline-danger"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedFile(null)}
                disabled={loading}
              >
                {t("category:remove")}
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mb-3 import-area small">
          {t("category:download_template")}:
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              downloadCategoryTemplate();
            }}
            className="text-primary text-decoration-none btnfont"
            style={{ cursor: 'pointer' }}
          >
            {" "}XLSX
          </a>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 modal-footer-custom">
        <Button variant="outline-secondary" onClick={onClose} disabled={loading}>
          {t("category:cancel")}
        </Button>

        <Button variant="primary" onClick={handleUpload} disabled={loading}>
          {loading ? t("category:importing") : t("category:import")}
        </Button>
      </div>
    </div>
  );
};

export default CategoryImportModal;
