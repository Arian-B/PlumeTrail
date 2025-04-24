import { db } from "../db.js";

// Get all blog categories
export const getBlogCategories = async (req, res) => {
  console.log("🚀 Querying the database for categories...");
  try {
    const [data] = await db.query("SELECT * FROM blog_category");
    res.status(200).json(data);
  } catch (err) {
    console.error("🔥 Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Get a single blog category
export const getBlogCategory = async (req, res) => {
  const q = "SELECT * FROM blog_category WHERE bc_id = ?";

  try {
    const [data] = await db.query(q, [req.params.id]);
    if (data.length === 0) {
      return res.status(404).json({ message: "Category not found!" });
    }
    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Error fetching single category:", err);
    return res.status(500).json({ message: "Failed to fetch category.", error: err });
  }
};

// Add a new blog category
export const addBlogCategory = async (req, res) => {
  const { bc_title, bc_type, bc_desc, user_id } = req.body;

  // Validate inputs
  if (!bc_title || !bc_type || !bc_desc || !user_id) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const q = "INSERT INTO blog_category (bc_title, bc_type, bc_desc, user_id) VALUES (?)";
  const values = [bc_title, bc_type, bc_desc, user_id];

  try {
    await db.query(q, [values]); // Use await to handle the promise
    return res.status(201).json({ message: "Category has been added successfully." });
  } catch (err) {
    console.error("Error adding category:", err);
    return res.status(500).json({ message: "Failed to add category.", error: err });
  }
};

// Update a blog category
export const updateBlogCategory = async (req, res) => {
  const { bc_title, bc_type, bc_desc } = req.body;
  
  // Validate inputs
  if (!bc_title || !bc_type || !bc_desc) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const q = "UPDATE blog_category SET bc_title = ?, bc_type = ?, bc_desc = ? WHERE bc_id = ?";

  try {
    const [result] = await db.query(q, [bc_title, bc_type, bc_desc, req.params.id]);
    
    // Check if any rows were updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found or no changes made." });
    }
    
    return res.status(200).json({ message: "Category has been updated successfully." });
  } catch (err) {
    console.error("Error updating category:", err);
    return res.status(500).json({ message: "Failed to update category.", error: err });
  }
};

// Delete a blog category
export const deleteBlogCategory = async (req, res) => {
  const q = "DELETE FROM blog_category WHERE bc_id = ?";

  try {
    const [result] = await db.query(q, [req.params.id]);
    
    // Check if any rows were deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ message: "Category has been deleted successfully." });
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).json({ message: "Failed to delete category.", error: err });
  }
};
