import React, { useState, useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Write.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const [catRes, blogRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get(`/api/blogs/${id}`)
        ]);
        setCategories(catRes.data);
        setTitle(blogRes.data.blog_title);
        setContent(blogRes.data.blog_content);
        setImgUrl(blogRes.data.img || "");
        setCategoryId(blogRes.data.category_id || "");
        setLoading(false);
      } catch (err) {
        setError("Could not load blog or categories.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const blogPayload = {
        blog_title: title,
        blog_content: content,
        category_id: categoryId || null,
        img: imgUrl || ""
      };
      const token = localStorage.getItem("token");
      await axios.put(`/api/blogs/${id}`, blogPayload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      alert("Blog updated successfully!");
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || "Blog update failed. Please try again."
      );
    }
  };

  if (loading) return <div className="write-page-bg"><p>Loading...</p></div>;

  return (
    <div className="write-page-bg">
      <div className="write-center-wrap">
        <form className="write-form" onSubmit={handleSubmit}>
          <label htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <label htmlFor="blog-category">Category</label>
          <select
            id="blog-category"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.bc_id} value={cat.bc_id}>{cat.bc_title}</option>
            ))}
          </select>
          <label htmlFor="blog-content">Content</label>
          <ReactQuill
            id="blog-content"
            value={content}
            onChange={setContent}
            placeholder="Edit your blog content here..."
            className="write-quill"
          />
          <label htmlFor="blog-image-url">Cover Image URL</label>
          <input
            id="blog-image-url"
            type="text"
            placeholder="Paste image URL here"
            value={imgUrl}
            onChange={e => setImgUrl(e.target.value)}
          />
          <button type="submit">Update Blog</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Edit;
