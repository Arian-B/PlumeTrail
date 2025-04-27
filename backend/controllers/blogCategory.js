import { sequelize } from '../models/index.js';
const { BlogCategory, User } = sequelize.models;

// Create a new blog category
export const createCategory = async (req, res) => {
  try {
    const { bc_title, bc_type, bc_desc, bc_content } = req.body;
    const userId = req.userId; // Set by JWT middleware
    const category = await BlogCategory.create({
      bc_title,
      bc_type,
      bc_desc,
      bc_content,
      user_id: userId
    });
    res.status(201).json({ message: 'Category created successfully!', category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['bc_title', 'ASC']]
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await BlogCategory.findByPk(id, {
      include: [{ model: User, attributes: ['username'] }]
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
