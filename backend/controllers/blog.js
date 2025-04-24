import { db } from '../db.js';
import jwt from 'jsonwebtoken';

// Get all blogs (with optional category filter)
export const getBlogs = (req, res) => {
  const q = req.query.cat
    ? 'SELECT * FROM blog WHERE blog_type = ?'
    : 'SELECT * FROM blog';

  db.query(q, req.query.cat ? [req.query.cat] : [], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};

// Get a single blog by ID
export const getBlog = (req, res) => {
  const q = `
    SELECT b.blog_id, u.username, b.blog_title, b.blog_desc, b.blog_content, b.blog_type, b.created_at, u.img AS userImg
    FROM users u
    JOIN blog b ON u.user_id = b.blog_author_id
    WHERE b.blog_id = ?`;

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

// Add a new blog post
export const addBlog = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      INSERT INTO blog (
        blog_title,
        blog_content,
        blog_author_id,
        category_id,
        img
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.blog_title,
      req.body.blog_content,
      userInfo.id,
      req.body.category_id || null,
      req.body.img || null,
    ];

    db.query(q, values, (err) => {
      if (err) {
        console.error("Error inserting blog:", err);
        return res.status(500).json("Error saving blog.");
      }
      return res.status(200).json({ message: "Blog has been created." });
    });
  });
};


// Delete a blog post
export const deleteBlog = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const blogId = req.params.id;
    const q = 'DELETE FROM blog WHERE blog_id = ? AND blog_author_id = ?';

    db.query(q, [blogId, userInfo.id], (err) => {
      if (err) return res.status(403).json('You can delete only your own blog!');
      return res.json('Blog has been deleted!');
    });
  });
};

// Update a blog post
export const updateBlog = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const blogId = req.params.id;

    const q = `
      UPDATE blog SET 
        blog_title = ?, 
        blog_content = ?, 
        category_id = ?, 
        img = ?
      WHERE blog_id = ? AND blog_author_id = ?
    `;

    const values = [
      req.body.blog_title,
      req.body.blog_content,
      req.body.category_id || null,
      req.body.img || null,
      blogId,
      userInfo.id,
    ];

    db.query(q, values, (err) => {
      if (err) {
        console.error("Error updating blog:", err);
        return res.status(500).json("Error updating blog.");
      }
      return res.status(200).json({ message: "Blog has been updated." });
    });
  });
};

