import { db } from '../db.js';
import jwt from 'jsonwebtoken';

// Get all blogs (with optional category filter)
export const getBlogs = (req, res) => {
  const q = req.query.cat
    ? 'SELECT * FROM blog WHERE blog_type = ?' // Use correct table and column names
    : 'SELECT * FROM blog';

  db.query(q, [req.query.cat], (err, data) => {
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
  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const q = 'INSERT INTO blog(blog_title, blog_desc, blog_content, blog_type, blog_author_id, category_id) VALUES (?)';

    const values = [
      req.body.blog_title,
      req.body.blog_desc,
      req.body.blog_content,
      req.body.blog_type,
      userInfo.id,
      req.body.category_id, // Assuming category is sent in the request body
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json('Blog has been created.');
    });
  });
};

// Delete a blog post
export const deleteBlog = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const blogId = req.params.id;
    const q = 'DELETE FROM blog WHERE blog_id = ? AND blog_author_id = ?';

    db.query(q, [blogId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json('You can delete only your own blog!');

      return res.json('Blog has been deleted!');
    });
  });
};

// Update a blog post
export const updateBlog = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const blogId = req.params.id;
    const q =
      'UPDATE blog SET blog_title = ?, blog_desc = ?, blog_content = ?, blog_type = ?, category_id = ? WHERE blog_id = ? AND blog_author_id = ?';

    const values = [
      req.body.blog_title,
      req.body.blog_desc,
      req.body.blog_content,
      req.body.blog_type,
      req.body.category_id,
    ];

    db.query(q, [...values, blogId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json('Blog has been updated.');
    });
  });
};
