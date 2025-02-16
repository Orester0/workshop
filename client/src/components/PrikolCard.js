import React, { useState, useEffect } from "react";

const PrikolCard = ({ joke, onReact, onDelete, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [newText, setNewText] = useState(joke.text);
  const [newReactions, setNewReactions] = useState(joke.possibleReactions.join(", "));
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setNewText(joke.text);
    setNewReactions(joke.possibleReactions.join(", "));
  }, [joke]);

  const handleUpdate = () => {
    const updatedReactions = newReactions.split(",").map((r) => r.trim()).filter(r => r);
    onUpdate(joke._id, newText, updatedReactions);
    setEditMode(false);
  };

  return (
    <div className="card shadow-lg p-3 mb-4 bg-white rounded" style={{ width: "24rem" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title fw-bold" style={{ fontSize: "1.4rem" }}>Prikol</h5>
          <button onClick={() => setExpanded(!expanded)} className="btn btn-sm btn-outline-secondary">
            {expanded ? "▲" : "▼"}
          </button>
        </div>

        {editMode ? (
          <>
            <textarea
              className="form-control mb-2"
              rows="3"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Possible reactions (using comma)"
              value={newReactions}
              onChange={(e) => setNewReactions(e.target.value)}
            />
            <button onClick={handleUpdate} className="btn btn-success btn-sm me-2">Save</button>
            <button onClick={() => setEditMode(false)} className="btn btn-secondary btn-sm">Cancel</button>
          </>
        ) : (
          <>
            <p className="card-text" style={{ fontSize: "1.2rem" }}>{joke.text}</p>
            {expanded && (
              <div className="d-flex gap-2 mt-3">
                <button onClick={() => setEditMode(true)} className="btn btn-warning btn-sm">Update</button>
                <button onClick={() => onDelete(joke._id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            )}
          </>
        )}

        <div className="mt-3">
          <p className="fw-bold">Reactions:</p>
          {joke.possibleReactions.length > 0 ? (
            joke.possibleReactions.map((reaction) => (
              <button
                key={reaction}
                onClick={() => onReact(joke._id, reaction)}
                className="btn btn-outline-primary btn-sm me-2"
                style={{ fontSize: "1.2rem", padding: "6px 12px" }}
              >
                {reaction} ({joke.reactions[reaction] || 0})
              </button>
            ))
          ) : (
            <p className="text-muted">No reactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrikolCard;
