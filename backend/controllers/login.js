import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register endpoint
export const register = async (req, res) => {
  try {
    console.log('Register endpoint hit'); // Debug log
    const { username, password } = req.body;

    // Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    const [existingUser] = await db.query(checkQuery, [username]);

    if (existingUser.length) {
      return res.status(409).json({ message: 'User already exists!' });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 1. Insert into login table first with default role_id = 2 (regular user)
    const insertLoginQuery = 'INSERT INTO login (login_role_id, login_username, user_password) VALUES (?, ?, ?)';
    const [loginResult] = await db.query(insertLoginQuery, [2, username, hashedPassword]);
    const loginId = loginResult.insertId;

    // 2. Now insert into users table using the loginId we just created
    const insertUserQuery = 'INSERT INTO users (username, password, login_id) VALUES (?, ?, ?)';
    await db.query(insertUserQuery, [username, hashedPassword, loginId]);

    return res.status(200).json({ message: 'User has been registered.' });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Something went wrong during registration.' });
  }
};

// Login endpoint
export const login = async (req, res) => {
  try {
    console.log('Login endpoint hit'); // Debug log
    const { username, password } = req.body;

    const loginQuery = `
      SELECT u.*, l.login_role_id, r.role_name
      FROM users u
      JOIN login l ON u.login_id = l.login_id
      JOIN roles r ON l.login_role_id = r.role_id
      WHERE u.username = ?
    `;

    const [userRows] = await db.query(loginQuery, [username]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const user = userRows[0];

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Wrong username or password!' });
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);

    const { password: _, ...userData } = user;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(userData);
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Something went wrong during login.' });
  }
};

// Logout endpoint
export const logout = (req, res) => {
  res
    .clearCookie('access_token', {
      sameSite: 'none',
      secure: true,
    })
    .status(200)
    .json({ message: 'User has been logged out.' });
};
