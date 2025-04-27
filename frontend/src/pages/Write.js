import React, { useState, useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Write.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Write = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        setError("Could not load categories. Please try again.");
        console.error("[Write] Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);



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
      // Attach JWT token for authorization
      const token = localStorage.getItem("token");
      await axios.post("/api/blogs", blogPayload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || "Blog post failed. Please try again."
      );
      console.error("[Write] Blog post failed:", err);
    }
  };

  return (
    <div className="write-page-bg">
      <div className="write-center-wrap">
        <h1 style={{ color: '#008b94', fontWeight: 700, marginBottom: '1.7rem' }}>Write a Blog</h1>
        <form className="write-form" onSubmit={handleSubmit}>
          <label htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
            required
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="blog-category">Category</label>
          <select
            id="blog-category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.bc_id} value={cat.bc_id}>
                {cat.bc_title}
              </option>
            ))}
          </select>
          <label htmlFor="blog-content">Content</label>
          <ReactQuill
            id="blog-content"
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Write your blog content here..."
            className="write-quill"
          />
          <label htmlFor="blog-image-url">Cover Image URL</label>
          <input
            id="blog-image-url"
            type="text"
            placeholder="Paste image URL here"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          />
          <button type="submit">Publish</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Write;
