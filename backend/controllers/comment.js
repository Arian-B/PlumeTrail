import { db } from "../db.js";

// Get all comments for a specific blog
export const getComments = (req, res) => {
  const q = "SELECT * FROM comments WHERE comm_blog_id = ?";

  db.query(q, [req.params.blogId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Add a new comment
export const addComment = (req, res) => {
  const { comm_user_id, comm_blog_id, content } = req.body;

  const q = "INSERT INTO comments (comm_user_id, comm_blog_id, content) VALUES (?)";
  const values = [comm_user_id, comm_blog_id, content];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Comment has been added.");
  });
};

// Update a comment
export const updateComment = (req, res) => {
  const { content } = req.body;

  const q = "UPDATE comments SET content = ? WHERE comm_id = ?";

  db.query(q, [content, req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Comment has been updated.");
  });
};

// Delete a comment
export const deleteComment = (req, res) => {
  const q = "DELETE FROM comments WHERE comm_id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Comment has been deleted.");
  });
};
