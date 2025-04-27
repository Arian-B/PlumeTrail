import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import "./Single.css";

import { useNavigate } from "react-router-dom";

const Single = () => {
  const navigate = useNavigate();
  // ...existing state and hooks...

  // Dedicated handler for comment deletion
  const handleDeleteComment = async (comm_id) => {
    setCommentError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/comments/${comm_id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      // Refresh comments from backend to ensure up-to-date state
      const res = await axios.get(`/api/comments/blog/${id}`);
      setComments(res.data);
    } catch (err) {
      setCommentError(
        err.response?.data?.message || err.response?.data?.error || "Failed to delete comment."
      );
      console.error("[Single] Failed to delete comment:", err);
    }
  };
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setPost(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load the post. Please try again later.");
        console.error("[Single] Failed to load post:", err);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await axios.get(`/api/comments/blog/${id}`);
        setComments(res.data);
      } catch (err) {
        setComments([]);
        setCommentError("Failed to load comments. Please try again later.");
        console.error("[Single] Failed to load comments:", err);
      }
      setCommentsLoading(false);
    };
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);
    if (!commentInput.trim()) return;
    try {
      // Attach JWT token for authorization
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/comments/",
        { comm_blog_id: id, content: commentInput },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined
          }
        }
      );
      setCommentInput("");
      // Refresh comments
      const res = await axios.get(`/api/comments/blog/${id}`);
      setComments(res.data);
    } catch (err) {
      setCommentError(
        err.response?.data?.message || err.response?.data?.error || "Failed to add comment."
      );
      console.error("[Single] Failed to add comment:", err);
    }
  };

  if (loading) return <div className="single-page"><p>Loading...</p></div>;
  if (error) return <div className="single-page"><p className="error">{error}</p></div>;
  if (!post) return <div className="single-page"><p>No blog post found.</p></div>;

  return (
    <div className="single-page">
      <div className="single-center-wrap">
        {/* Edit/Delete box for author only */}
        {currentUser && post.blog_author_id === currentUser.user_id && (
          <div className="blog-action-box">
            <button className="edit-btn" onClick={() => navigate(`/edit/${post.blog_id}`)}>Edit</button>
            <button className="delete-btn" onClick={async () => {
              if (window.confirm('Do you wish to delete blog ?')) {
                try {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    alert('Session expired. Please log in again.');
                    window.location.href = '/login';
                    return;
                  }
                  await axios.delete(`/api/blogs/${post.blog_id}`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  alert('Deleted successfully');
                  window.location.href = '/';
                } catch (err) {
                  if (err.response && err.response.data && (err.response.data.message || err.response.data.error)) {
                    const backendMsg = err.response.data.message || err.response.data.error;
                    if (backendMsg.toLowerCase().includes('token')) {
                      alert('Session expired or invalid token. Please log in again.');
                      window.location.href = '/login';
                      return;
                    }
                    alert('Failed to delete blog.\n' + backendMsg);
                  } else {
                    alert('Failed to delete blog.');
                  }
                }
              }
            }}>Delete</button>
          </div>
        )}
        <div className="single-content">
          <h1>{post.blog_title}</h1>
          <div className="meta">
            <span>By {post.User?.username || "Unknown"}</span>
            <span> | Category: {post.BlogCategory?.bc_title || "Uncategorized"}</span>
            <span> | {new Date(post.created_at).toLocaleString()}</span>
          </div>
          {post.img && <img className="cover-img" src={post.img} alt="Post Cover" onError={e => { e.target.style.display = 'none'; }} />}
          <div className="blog-body">
            <div dangerouslySetInnerHTML={{ __html: post.blog_content }} />
          </div>
        </div>
        <div className="comments-section">
          <h3>Comments</h3>
          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul className="comments-list">
              {comments.map((comm) => (
                <li key={comm.id || comm.comm_id}>
                  <strong className="comment-username">{comm.User?.username || "User"}</strong>: {comm.content}
                  {currentUser && (comm.comm_user_id === currentUser.user_id) && (
  <button
    className="delete-comment"
    onClick={() => handleDeleteComment(comm.comm_id)}
  >
    Delete
  </button>
)}
                </li>
              ))}
            </ul>
          )}
          {currentUser ? (
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                maxLength={200}
                required
              />
              <button type="submit">Submit Comment</button>
              {commentError && <p className="error">{commentError}</p>}
            </form>
          ) : (
            <p>Login to add a comment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Single;
