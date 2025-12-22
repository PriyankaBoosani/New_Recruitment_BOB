import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Upload } from 'react-bootstrap-icons';
import { FileMeta, downloadTemplate } from '../../../../../shared/components/FileUpload';

import { useTranslation } from "react-i18next";

const CategoryImportModal = ({ onImport }) => {
  const { t } = useTranslation(["category"]);
  const [selectedCSVFile, setSelectedCSVFile] = useState(null);
  const [selectedXLSXFile, setSelectedXLSXFile] = useState(null);

  return (
    <>
      <div className="import-area p-4 rounded" style={{ background: "#fceee9" }}>
        <div className="text-center mb-3">
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto"
            }}
          >
            <Upload size={32} />
          </div>

          <h5 className="mt-3 uploadfile">{t("upload_file")}</h5>
          <p className="text-muted small">{t("support_csv_xlsx")}</p>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <input
            id="upload-csv-cat"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => setSelectedCSVFile(e.target.files[0])}
          />
          <label htmlFor="upload-csv-cat">
            <Button as="span" variant="light" className="btnfont">{t("upload_csv")}</Button>
          </label>

          <input
            id="upload-xlsx-cat"
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={(e) => setSelectedXLSXFile(e.target.files[0])}
          />
          <label htmlFor="upload-xlsx-cat">
            <Button as="span" variant="light" className="btnfont">{t("upload_xlsx")}</Button>
          </label>

          <FileMeta file={selectedCSVFile} onRemove={() => setSelectedCSVFile(null)} />
          <FileMeta file={selectedXLSXFile} onRemove={() => setSelectedXLSXFile(null)} />
        </div>

        <div className="text-center mt-4 small">
          {t("download_template")}:&nbsp;
          <Button
            variant="link"
            onClick={() =>
              downloadTemplate(
                ['code', 'name', 'description'],
                ['UR', 'Unreserved', 'Example description'],
                'categories-template'
              )
            }
          >
            CSV
          </Button>
          |
          <Button
            variant="link"
            onClick={() =>
              downloadTemplate(
                ['code', 'name', 'description'],
                ['UR', 'Unreserved', 'Example description'],
                'categories-template'
              )
            }
          >
            XLSX
          </Button>
        </div>
      </div>

      <div className="modal-footer-custom px-0 pt-4">
        <Button
          variant="primary"
          onClick={() =>
            onImport({
              selectedCSVFile,
              selectedXLSXFile
            })
          }
        >
          {t("import")}
        </Button>
      </div>
    </>
  );
};

export default CategoryImportModal;
