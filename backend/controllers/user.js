import { db } from "../db.js";
import jwt from "jsonwebtoken";

// Get all users
export const getUsers = (req, res) => {
  const q = "SELECT * FROM users";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Get a single user by ID
export const getUser = (req, res) => {
  const q = "SELECT * FROM users WHERE user_id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");
    return res.status(200).json(data[0]);
  });
};

// Update user details
export const updateUser = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET username = ?, email = ? WHERE user_id = ?";

    const values = [req.body.username, req.body.email];

    db.query(q, [...values, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been updated.");
    });
  });
};

// Delete a user
export const deleteUser = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM users WHERE user_id = ?";

    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been deleted.");
    });
  });
};
