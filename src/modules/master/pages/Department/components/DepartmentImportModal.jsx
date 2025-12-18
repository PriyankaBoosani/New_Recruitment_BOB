import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Upload as UploadIcon, Download } from 'react-bootstrap-icons';
import { useDepartments } from '../hooks/useDepartments'; // Adjust path

const DepartmentImportView = ({
  t,
  onClose = () => { },
  onSuccess = () => { }
}) => {
  const { bulkAddDepartments, downloadDepartmentTemplate, loading } = useDepartments();
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
      setError('Please upload a valid Excel file (.xlsx, .xls)');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    const result = await bulkAddDepartments(selectedFile);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <div className="import-area p-4 rounded" style={{ background: '#fceee9' }}>
        <div className="text-center mb-3">
          <div style={{ width: 72, height: 72, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', marginBottom: '1rem' }}>
            <UploadIcon size={32} />
          </div>
          <h5 className="mb-2">Upload Departments</h5>
          <p className="text-muted small">Please upload an Excel file (.xlsx, .xls)</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <input id="upload-xlsx" type="file" accept=".xlsx,.xls" hidden onChange={handleFileChange} disabled={loading} />

        <div className="text-center mb-3">
          <label htmlFor="upload-xlsx">
            <Button variant="light" as="span" className="btnfont" disabled={loading}>
              {selectedFile ? 'Reupload Xlsx' : 'Upload Xlsx'}
            </Button>
          </label>

          {selectedFile && (
            <div className="mt-2">
              <small className="text-muted d-block">{selectedFile.name}</small>
              <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => setSelectedFile(null)} disabled={loading}>
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* Replace the existing Download Template button with this text link */}
        <div className="text-center mb-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              downloadDepartmentTemplate();
            }}
            className="text-primary text-decoration-none"
            style={{ cursor: 'pointer' }}
          >
           
           <span>Download template: </span> XLSX
          </a>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 modal-footer-custom">
        <Button variant="outline-secondary" onClick={onClose} disabled={loading}>
          {t ? t("cancel") : 'Cancel'}
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={loading}>
          {loading ? 'Importing...' : (t ? t("import") : 'Import')}
        </Button>
      </div>
    </div>
  );
};

export default DepartmentImportView;