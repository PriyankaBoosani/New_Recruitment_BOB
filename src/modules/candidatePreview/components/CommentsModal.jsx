import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const CommentsModal = ({ show, onClose }) => {
  const [newComment, setNewComment] = useState("");

  // 🔹 Static mock data (for now)
  const comments = [
    {
      id: 1,
      user: "Zonal HR",
      text: "Documents look fine overall.",
      time: "2026-05-01 10:30 AM",
    },
    {
      id: 2,
      user: "Screening Team",
      text: "Work experience needs re-check.",
      time: "2026-05-02 02:15 PM",
    },
  ];

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    console.log("New Comment:", newComment);

    // Later → API call
    setNewComment("");
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '1rem', color: '#2f3a8f' }}>Comments</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        {/* COMMENTS LIST */}
        <div className="mb-3">
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid #eee",
                borderRadius: "6px",
                padding: "10px",
                marginBottom: "10px",
                background: "#f9f9f9",
              }}
            >
              <div style={{ fontWeight: "500", color: '#2f3a8f', fontSize: '1rem' }}>{c.user}</div>
              <div style={{ fontSize: "0.875rem" }} className="mt-1">
                {c.text}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#888" }} className="mt-1">
                {c.time}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <textarea
          className="form-control"
          rows={3}
          placeholder="Enter your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="btn" onClick={onClose} style={{ fontSize: '0.875rem', border: '1px solid #333', color: '#333' }}>
          Close
        </Button>
        <Button variant="btn primary" onClick={handleAddComment} style={{ fontSize: '0.875rem', backgroundColor: '#f47c2c', color: '#fff' }}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentsModal;