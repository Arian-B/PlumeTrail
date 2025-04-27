import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import "./Navbar.css";
import "./SearchDropdown.css";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        setCategories([]); // Fallback to empty
      }
    };
    fetchCategories();
  }, []);

  const visibleCategories = categories.slice(0, 3);
  const dropdownCategories = categories.slice(3);

  // Search state
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  let searchTimeout = null;

  // Search blogs by title as user types
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setShowSearchDropdown(true);
    setSearchError(null);
    // Debounce API call
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/blogs`); // Get all blogs, filter client-side
        const query = search.trim().toLowerCase();
        const filtered = res.data.filter(post => post.blog_title.toLowerCase().includes(query));
        setSearchResults(filtered);
      } catch (err) {
        setSearchResults([]);
        setSearchError("Failed to search blogs.");
      }
      setSearchLoading(false);
    }, 200);
    return () => clearTimeout(searchTimeout);
  }, [search]);

  // Highlight matching letters in blog title
  function highlightMatch(title, query) {
    if (!query) return title;
    const idx = title.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return title;
    return <>
      {title.slice(0, idx)}
      <span className="search-highlight">{title.slice(idx, idx + query.length)}</span>
      {title.slice(idx + query.length)}
    </>;
  }

  // On result click, go to category page
  function handleSearchResultClick(blog) {
    if (blog.category_id) {
      navigate(`/?cat=${blog.category_id}`);
      setShowSearchDropdown(false);
      setSearch("");
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo" style={{fontWeight: 'bold', fontSize: '1.5rem', color: 'white', padding: '0.5rem'}}>
          PlumeTrail
        </Link>
      </div>
      <div className="navbar-center">
        {visibleCategories.map((cat) => (
          <Link key={cat.bc_id} to={`/?cat=${cat.bc_id}`} className="navbar-cat">
            <b>{cat.bc_title}</b>
          </Link>
        ))}
        {dropdownCategories.length > 0 && (
          <div className="navbar-dropdown">
            <span className="navbar-dropdown-text">More</span>
            <div className="navbar-dropdown-content">
              {dropdownCategories.map((cat) => (
                <Link key={cat.bc_id} to={`/?cat=${cat.bc_id}`} className="navbar-cat">
                  <b>{cat.bc_title}</b>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="navbar-right">
        <div className="navbar-search">
          <span className="navbar-search-icon">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="none"/>
              <path d="M20.5 20.5L16.5 16.5" stroke="#00cccc" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="11" cy="11" r="6" fill="none" stroke="#00cccc" strokeWidth="2"/>
            </svg>
          </span>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => search && setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            autoComplete="off"
            style={{paddingLeft: '2.5rem'}}
          />
          {showSearchDropdown && (
            <div className="navbar-search-dropdown">
              {searchLoading && <div className="navbar-search-result">Searching...</div>}
              {searchError && <div className="navbar-search-result" style={{color: 'red'}}>{searchError}</div>}
              {(!searchLoading && !searchError && searchResults.length === 0) && (
                <div className="navbar-search-result">No blogs found.</div>
              )}
              {searchResults.map(blog => (
                <div
                  key={blog.blog_id}
                  className="navbar-search-result"
                  onMouseDown={() => handleSearchResultClick(blog)}
                >
                  {highlightMatch(blog.blog_title, search)}
                </div>
              ))}
            </div>
          )}
        </div>
        {currentUser ? (
          <>
            <Link to="/write" className="navbar-write-btn">Write</Link>
            <span className="navbar-user">{currentUser.username}</span>
            <button className="navbar-logout" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-auth">Login</Link>
            <Link to="/register" className="navbar-auth">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
