import React from "react";
import { Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import viewIcon from "../../../../../assets/view_icon.png";
import downloadIcon from "../../../../../assets/downloadIcon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

const GenericOrAnnexuresTable = ({
  data = [],
  onView,
  onDownload,
  onDelete
}) => {
  const { t } = useTranslation(["genericOrAnnexures"]); // ✅ ADD
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="table-responsive">
      <Table hover className="user-table">
        <thead>
          <tr>
            <th style={{ width: "70px" }}>{t("s_no")}</th>
            <th>{t("type")}</th>
            <th>{t("file")}</th>
            <th>{t("version")}</th>
            <th style={{ width: "140px", textAlign: "center" }}>
              {t("actions")}
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item?.type || "-"}</td>
               <td>{item?.fileName || "-"}</td>
               <td>{item?.version || "-"}</td>


                <td>
                  <div className="action-buttons">
                    {/* VIEW */}
                    <Button
                      variant="link"
                      className="action-btn view-btn"
                      onClick={() => onView(item)}
                    >
                      <img
                        src={viewIcon}
                        alt={t("view")}
                        className="icon-16"
                      />
                    </Button>

                    {/* DOWNLOAD */}
                    <Button
                      variant="link"
                      className="action-btn edit-btn"
                      onClick={() => onDownload(item)}
                    >
                      <img
                        src={downloadIcon}
                        alt={t("download")}
                        className="icon-16"
                      />
                    </Button>

                    {/* DELETE */}
                    <Button
                      variant="link"
                      className="action-btn delete-btn"
                      onClick={() => onDelete(item)}
                    >
                      <img
                        src={deleteIcon}
                        alt={t("delete")}
                        className="icon-16"
                      />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                {t("no_records")}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default GenericOrAnnexuresTable;
