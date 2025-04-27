import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Home.css";

import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const catParam = new URLSearchParams(location.search).get("cat");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (catParam) {
          res = await axios.get(`/api/blogs/category/${catParam}`);
        } else {
          res = await axios.get(`/api/blogs`);
        }
        // Map backend fields to frontend expected fields
        const mappedPosts = res.data.map((post) => ({
          id: post.blog_id,
          title: post.blog_title,
          desc: post.blog_content,
          img: post.img,
          category: post.BlogCategory?.bc_title,
          author: post.User?.username
        }));
        setPosts(mappedPosts);
      } catch (err) {
        setPosts([]);
        setError("Failed to fetch posts. Please try again later.");
        console.error("[Home] Failed to fetch posts:", err);
      }
    };
    fetchData();
  }, [catParam]);

  const getText = (html) => {
    const doc = new window.DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  if (!currentUser) {
    return (
      <div className="home">
        <div className="no-posts" style={{textAlign: 'center', marginTop: '4rem', fontSize: '1.3rem', color: '#888'}}>
          Please log in to view blogs.
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className={`post${!post.img ? " no-image" : ""}`} key={post.id}>
              {post.img && (
                <div className="img">
                  
                  <img
                    src={post.img}
                    alt={post.title}
                    style={{ maxWidth: 200 }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="content">
                <Link className="link" to={`/blog/${post.id}`}>
                  <h1>{post.title}</h1>
                </Link>
                <p className="blog-preview-text">{(() => {
                  const text = getText(post.desc).trim();
                  const words = text.split(/\s+/);
                  let preview = words.slice(0, 15).join(' ');
                  if (preview.length > 90) preview = preview.slice(0, 90);
                  if (text.length > preview.length) preview += ' ...';
                  return preview;
                })()}</p>

              </div>
            </div>
          ))
        ) : (
          <p className="no-posts">No posts found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
