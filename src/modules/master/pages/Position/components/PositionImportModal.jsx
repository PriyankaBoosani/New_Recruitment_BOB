// src/modules/master/pages/Position/components/PositionImportModal.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { Upload as UploadIcon } from "react-bootstrap-icons";
import { FileMeta, downloadTemplate } from "../../../../../shared/components/FileUpload";

const PositionImportModal = ({
  t,
  selectedCSVFile,
  selectedXLSXFile,
  onSelectCSV,
  onSelectXLSX,
  removeCSV,
  removeXLSX
}) => {
  return (
    <div className="import-area p-4 rounded" style={{ background: "#fceee9" }}>
      <div className="text-center mb-3">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            marginBottom: "1rem"
          }}
        >
          <UploadIcon size={32} />
        </div>
        <h5 className="mb-2 uploadfile">{t("upload_file")}</h5>
        <p className="text-muted small">{t("support_csv_xlsx")}</p>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
        <input
          id="upload-csv-position"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => onSelectCSV(e.target.files[0])}
        />
        <label htmlFor="upload-csv-position">
          <Button variant="light" as="span" className="btnfont">
            {t("upload_csv")}
          </Button>
        </label>

        <input
          id="upload-xlsx-position"
          type="file"
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          onChange={(e) => onSelectXLSX(e.target.files[0])}
        />
        <label htmlFor="upload-xlsx-position">
          <Button variant="light" as="span" className="btnfont">
            {t("upload_xlsx")}
          </Button>
        </label>

        <FileMeta file={selectedCSVFile} onRemove={removeCSV} />
        <FileMeta file={selectedXLSXFile} onRemove={removeXLSX} />
      </div>

      <div className="text-center mt-4 small">
        {t("download_template")}:&nbsp;
        <Button
          variant="link"
          onClick={() =>
            downloadTemplate(
              ["title", "department", "jobGrade", "description"],
              ["Frontend Developer", "IT", "JG2", "React developer"],
              "position-template",
              "csv"
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
              ["title", "department", "jobGrade", "description"],
              ["Frontend Developer", "IT", "JG2", "React developer"],
              "position-template",
              "xlsx"
            )
          }
        >
          XLSX
        </Button>
      </div>
    </div>
  );
};

export default PositionImportModal;
