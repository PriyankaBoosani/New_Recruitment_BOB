// src/modules/master/pages/JobGrade/components/JobGradeImportModal.jsx

import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Upload as UploadIcon } from 'react-bootstrap-icons';
import { downloadTemplate } from '../../../../../shared/components/FileUpload';

const JobGradeImportModal = ({
  t,
  selectedFile,
  onSelectFile,
  onRemoveFile
}) => {
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const isValid =
      file &&
      (
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'text/csv'
      );

    if (!isValid) {
      setError(t("invalid_file"));
      return;
    }

    setError('');
    onSelectFile(file);
  };

  return (
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
          {t("upload_file")}
        </h5>

        <p className="text-muted small">
          {t("support_csv_xlsx")}
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* SINGLE MIDDLE UPLOAD BUTTON */}
      <input
        id="upload-jobgrade"
        type="file"
        accept=".csv,.xlsx,.xls"
        hidden
        onChange={handleFileChange}
      />

      <div className="text-center mb-3">
        <label htmlFor="upload-jobgrade">
          <Button variant="primary" as="span" className="btnupload">
            {selectedFile ? t("reupload_file") : t("upload_file")}
          </Button>
        </label>

        {selectedFile && (
          <div className="mt-2">
            <small className="text-muted d-block">{selectedFile.name}</small>
            <Button
              variant="outline-danger"
              size="sm"
              className="mt-2"
              onClick={onRemoveFile}
            >
              {t("remove")}
            </Button>
          </div>
        )}
      </div>

      <div className="text-center mt-3 small">
        {t("download_template")} :
        <Button
          variant="link"
          onClick={() =>
            downloadTemplate(
              ['scale', 'gradeCode', 'minSalary', 'maxSalary', 'description'],
              ['Scale-I', 'JG1', 30000, 50000, 'Entry level'],
              'jobgrade-template',
              'xlsx'
            )
          }
        >
          XLSX
        </Button>
      </div>
    </div>
  );
};

export default JobGradeImportModal;
