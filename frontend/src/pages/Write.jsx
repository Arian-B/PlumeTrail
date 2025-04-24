import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Write = () => {
  const state = useLocation().state;
  const navigate = useNavigate();

  const [title, setTitle] = useState(state?.blog_title || "");
  const [content, setContent] = useState(state?.blog_content || "");
  const [file, setFile] = useState(null);
  const [categoryId, setCategoryId] = useState(state?.category_id || "");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/blogCategory", {
          withCredentials: true,
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Could not load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const uploadImage = async () => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8800/api/upload", formData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
    // Immediately redirect first
    navigate("/");

    try {
      const imageUrl = await uploadImage();

      const blogPayload = {
        blog_title: title,
        blog_content: content,
        category_id: categoryId || null,
        img: imageUrl || "",
      };

      if (state) {
        await axios.put(
          `http://localhost:8800/api/blog/${state.blog_id}`,
          blogPayload,
          { withCredentials: true }
        );
      } else {
        await axios.post("http://localhost:8800/api/blog", blogPayload, {
          withCredentials: true,
        });
      }
    } catch (err) {
      console.error("Blog submission error (still redirected):", err);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={content}
            onChange={setContent}
          />
        </div>
      </div>

      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span><b>Status:</b> Draft</span>
          <span><b>Visibility:</b> Public</span>

          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>

          <div className="buttons">
            <button disabled>Save as draft</button>
            <button onClick={handleSubmit}>Publish</button>
          </div>

          {error && <p className="error">{error}</p>}
        </div>

        <div className="item">
          <h1>Category</h1>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div className="cat" key={cat.bc_id}>
                <input
                  type="radio"
                  id={`cat-${cat.bc_id}`}
                  name="category"
                  value={cat.bc_id}
                  checked={String(categoryId) === String(cat.bc_id)}
                  onChange={(e) => setCategoryId(e.target.value)}
                />
                <label htmlFor={`cat-${cat.bc_id}`}>{cat.bc_title}</label>
              </div>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Write;
