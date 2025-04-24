import axios from "axios";
import React, { useEffect, useState } from "react";

const Menu = ({ cat }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/blog?cat=${cat}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch related posts:", err);
      }
    };
    if (cat) fetchData();
  }, [cat]);

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {posts.length ? (
        posts.map((post) => (
          <div className="post" key={post.id}>
            <img src={`../upload/${post?.img || "default.png"}`} alt={post.title} />
            <h2>{post.title}</h2>
            <button>Read More</button>
          </div>
        ))
      ) : (
        <p>No related posts found.</p>
      )}
    </div>
  );
};

export default Menu;
