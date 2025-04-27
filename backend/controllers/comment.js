import { sequelize } from '../models/index.js';
const { Comment, Blog, User } = sequelize.models;

// Add a comment to a blog
export const addComment = async (req, res) => {
  try {
    const { comm_blog_id, content } = req.body;
    const userId = req.userId; // Set by JWT middleware
    const comment = await Comment.create({
      comm_user_id: userId,
      comm_blog_id,
      content
    });
    // Increment comment count for the blog
    await Blog.increment('comments_count', { by: 1, where: { blog_id: comm_blog_id } });
    res.status(201).json({ message: 'Comment added successfully!', comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all comments for a specific blog
export const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.findAll({
      where: { comm_blog_id: blogId },
      include: [{ model: User, attributes: ['username'] }],
      order: [['created_at', 'ASC']]
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment (only owner can delete)
export const deleteComment = async (req, res) => {
  try {
    const { comm_id } = req.params;
    const userId = req.userId; // Set by JWT middleware
    // Find the comment
    const comment = await Comment.findByPk(comm_id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    if (comment.comm_user_id !== userId) {
      return res.status(403).json({ error: 'You can only delete your own comments.' });
    }
    // Store blog ID before deleting
    const blogId = comment.comm_blog_id;
    await comment.destroy();
    // Decrement comment count for the blog
    await Blog.decrement('comments_count', { by: 1, where: { blog_id: blogId } });
    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
