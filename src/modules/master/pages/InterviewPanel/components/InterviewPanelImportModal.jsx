// src/modules/master/pages/InterviewPanel/components/InterviewPanelImportModal.jsx

import React from 'react';
import { Button } from 'react-bootstrap';
import { Upload as UploadIcon } from 'react-bootstrap-icons';
import { FileMeta, downloadTemplate } from '../../../../../shared/components/FileUpload';

const InterviewPanelImportModal = ({
  t,
  selectedCSVFile,
  selectedXLSXFile,
  onSelectCSV,
  onSelectXLSX,
  removeCSV,
  removeXLSX
}) => {
  return (
    <div className="import-area p-4 rounded" style={{ background: '#fceee9' }}>
      <div className="text-center mb-3">
        <div className="upload-icon-box">
          <UploadIcon size={32} />
        </div>
        <h5 className="uploadfile">{t("upload_file")}</h5>
        <p className="text-muted small">{t("supported_formats")}</p>
      </div>

      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <input
          id="panel-csv"
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => onSelectCSV(e.target.files[0])}
        />
        <label htmlFor="panel-csv">
          <Button variant="light" as="span">{t("upload_csv")}</Button>
        </label>

        <input
          id="panel-xlsx"
          type="file"
          accept=".xlsx,.xls"
          hidden
          onChange={(e) => onSelectXLSX(e.target.files[0])}
        />
        <label htmlFor="panel-xlsx">
          <Button variant="light" as="span">{t("upload_xlsx")}</Button>
        </label>

        <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
        <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />
      </div>

      <div className="text-center mt-4 small">
        {t("download_template")} :
        <Button variant="link" onClick={() => downloadTemplate('csv')}>
          CSV
        </Button>
        |
        <Button variant="link" onClick={() => downloadTemplate('xlsx')}>
          XLSX
        </Button>
      </div>
    </div>
  );
};

export default InterviewPanelImportModal;
