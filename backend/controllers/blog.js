import { sequelize } from '../models/index.js';
const { Blog, User, BlogCategory } = sequelize.models;

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { blog_title, blog_content, category_id, img } = req.body;
    const userId = req.userId; // Set by JWT middleware
    const blog = await Blog.create({
      blog_title,
      blog_content,
      blog_author_id: userId,
      category_id,
      img
    });
    res.status(201).json({ message: 'Blog created successfully!', blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all blogs (optionally with pagination)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        { model: User, attributes: ['username'] },
        { model: BlogCategory, attributes: ['bc_title'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get recent blogs for homepage (limit 5)
export const getRecentBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        { model: User, attributes: ['username'] },
        { model: BlogCategory, attributes: ['bc_title'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 5
    });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get blogs by category
export const getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const blogs = await Blog.findAll({
      where: { category_id: categoryId },
      include: [
        { model: User, attributes: ['username'] },
        { model: BlogCategory, attributes: ['bc_title'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id, {
      include: [
        { model: User, attributes: ['username'] },
        { model: BlogCategory, attributes: ['bc_title'] }
      ]
    });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a blog (only author can update)
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.blog_author_id !== userId) return res.status(403).json({ message: 'Not authorized' });
    const { blog_title, blog_content, category_id, img } = req.body;
    await blog.update({ blog_title, blog_content, category_id, img });
    res.status(200).json({ message: 'Blog updated successfully!', blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a blog (only author can delete)
export const deleteBlog = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.userId;
    const blog = await Blog.findByPk(id, { transaction: t });
    if (!blog) {
      await t.rollback();
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.blog_author_id !== userId) {
      await t.rollback();
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Delete all comments related to this blog
    await sequelize.models.Comment.destroy({ where: { comm_blog_id: id }, transaction: t });
    // Delete the blog itself
    await blog.destroy({ transaction: t });
    await t.commit();
    res.status(200).json({ message: 'Blog and related comments deleted successfully!' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};
