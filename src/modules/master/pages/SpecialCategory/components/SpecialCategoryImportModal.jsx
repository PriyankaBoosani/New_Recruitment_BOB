import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Upload as UploadIcon } from 'react-bootstrap-icons';
import { useTranslation } from "react-i18next";

import { useSpecialCategories } from '../hooks/useSpecialCategories';

const SpecialCategoryImportModal = ({
  onClose = () => {},
  onSuccess = () => {}
}) => {
  const { t } = useTranslation(["specialCategory"]);
  const {
    bulkAddSpecialCategories,
    downloadSpecialCategoryTemplate,
    loading
  } = useSpecialCategories();

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
      setError(t("specialCategory:invalid_file"));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("specialCategory:no_file_selected"));
      return;
    }

    const result = await bulkAddSpecialCategories(selectedFile);

    if (result?.success) {
      onSuccess();
      onClose();
    } else {
      setError(result?.error || t("specialCategory:import_error"));
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
            {t("specialCategory:upload_special_categories")}
          </h5>

          <p className="text-muted small">
            {t("specialCategory:support_xlsx")}
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <input
          id="upload-xlsx-sc"
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={handleFileChange}
          disabled={loading}
        />

        <div className="text-center mb-3">
          <label htmlFor="upload-xlsx-sc">
            <Button
              variant="primary"
              as="span"
              className="btnupload"
              disabled={loading}
            >
              {selectedFile
                ? t("specialCategory:reupload_xlsx")
                : t("specialCategory:upload_xlsx")}
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
                {t("specialCategory:remove")}
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mb-3 import-area small">
          {t("specialCategory:download_template")}:
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              downloadSpecialCategoryTemplate();
            }}
            className="text-primary text-decoration-none btnfont"
            style={{ cursor: 'pointer' }}
          >
            {" "}XLSX
          </a>
        </div>
      </div>

     
    </div>
  );
};

export default SpecialCategoryImportModal;
