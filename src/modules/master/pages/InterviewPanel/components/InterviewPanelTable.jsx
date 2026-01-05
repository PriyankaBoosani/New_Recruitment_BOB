import React from 'react';
import { Table, Button } from 'react-bootstrap';
import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

const InterviewPanelTable = ({ data, onEdit, onView, onDelete, startIndex, t }) => (
  <Table hover className="user-table">
    <thead>
      <tr>
        <th>{t("sno")}</th>
        <th>{t("panel_name")}</th>
        <th>{t("community")}</th>
        <th>{t("panel_members")}</th>
        <th className="text-center">{t("actions")}</th>
      </tr>
    </thead>
    <tbody>
      {data.map((p, i) => (
        <tr key={p.id}>
          <td>{startIndex + i + 1}</td>
          <td>{p.name}</td>
          <td>{p.community}</td>
          <td>{p.members}</td>
          <td>
            <div className="action-buttons">
             <Button
              variant="link"
              className="action-btn"
              onClick={() => onView(p)}
            >
              <img src={viewIcon} className="icon-16" alt="view" />
            </Button>

              <Button variant="link" className="action-btn" onClick={() => onEdit(p)}><img src={editIcon} className="icon-16" alt="edit" /></Button>
              <Button variant="link" className="action-btn" onClick={() => onDelete(p)}><img src={deleteIcon} className="icon-16" alt="delete" /></Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);
export default InterviewPanelTable;