// components/PanelTable.jsx
import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import viewIcon from "../../../../../assets/view_icon.png";
import editIcon from "../../../../../assets/edit_icon.png";
import deleteIcon from "../../../../../assets/delete_icon.png";

const PanelTable = ({ panels, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 7;

  const filtered = panels.filter(p =>
    [p.name, p.members].some(v =>
      String(v || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const start = (page - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);
  const pages = Math.ceil(filtered.length / pageSize);

  return (
    <>
      <div className="user-actions mb-3">
        <div className="search-box">
          <Search />
          <Form.Control
            placeholder="Search"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Table hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Panel Name</th>
            <th>Community</th>
            <th>Members</th>
            <th align="center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {current.length ? (
            current.map((p, i) => (
              <tr key={p.id}>
                <td>{start + i + 1}</td>
                <td>{p.name}</td>
                <td>{p.community}</td>
                <td>{p.members}</td>
                <td>
                  <Button variant="link">
                    <img src={viewIcon} alt="view" />
                  </Button>
                  <Button variant="link" onClick={() => onEdit(p)}>
                    <img src={editIcon} alt="edit" />
                  </Button>
                  <Button variant="link" onClick={() => onDelete(p)}>
                    <img src={deleteIcon} alt="delete" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" align="center">No records found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {pages > 1 && (
        <ul className="pagination">
          {[...Array(pages)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default PanelTable;
