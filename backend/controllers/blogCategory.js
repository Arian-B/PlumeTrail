import { db } from "../db.js";

// Get all blog categories
export const getBlogCategories = (req, res) => {
  const q = "SELECT * FROM blog_category";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Get a single blog category
export const getBlogCategory = (req, res) => {
  const q = "SELECT * FROM blog_category WHERE bc_id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Category not found!");
    return res.status(200).json(data[0]);
  });
};

// Add a new blog category
export const addBlogCategory = (req, res) => {
  const { bc_title, bc_type, bc_desc, user_id } = req.body;

  const q = "INSERT INTO blog_category (bc_title, bc_type, bc_desc, user_id) VALUES (?)";
  const values = [bc_title, bc_type, bc_desc, user_id];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Category has been added.");
  });
};

// Update a blog category
export const updateBlogCategory = (req, res) => {
  const { bc_title, bc_type, bc_desc } = req.body;

  const q = "UPDATE blog_category SET bc_title = ?, bc_type = ?, bc_desc = ? WHERE bc_id = ?";

  db.query(q, [bc_title, bc_type, bc_desc, req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Category has been updated.");
  });
};

// Delete a blog category
export const deleteBlogCategory = (req, res) => {
  const q = "DELETE FROM blog_category WHERE bc_id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Category has been deleted.");
  });
};
