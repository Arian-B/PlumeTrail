import { sequelize } from '../models/index.js';
import bcrypt from 'bcryptjs';
const { User, Login, Role } = sequelize.models;

// Register a new user
export const register = async (req, res) => {
  try {
    // Extra debug: show type and value of req.body
    console.log('[REGISTER] Incoming req.body:', req.body, 'Type:', typeof req.body);
    const { username, password } = req.body || {};
    console.log('[REGISTER] Extracted username:', username, 'password:', password);
    if (!username || !password) {
      console.error('[REGISTER] Missing username or password:', { username, password });
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (typeof username !== 'string' || typeof password !== 'string') {
      console.error('[REGISTER] Username and password must be strings:', { username, password });
      return res.status(400).json({ message: 'Invalid input types.' });
    }
    // Check if username already exists in login table
    const exists = await Login.findOne({ where: { login_username: username } });
    if (exists) {
      console.error('[REGISTER] Username already exists:', username);
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role: first user is admin, others are user
    const userCount = await User.count();
    const login_role_id = userCount === 0 ? 1 : 2; // 1 = admin, 2 = user

    // Create login record (username used for login)
    const login = await Login.create({
      login_username: username,
      user_password: hashedPassword,
      login_role_id
    });

    // Create user record (username used for display)
    const user = await User.create({
      username,
      password: hashedPassword,
      login_id: login.login_id
    });

    console.log('[REGISTER] User registered:', username);
    res.status(201).json({ message: 'User registered successfully!', user });
  } catch (err) {
    console.error('[REGISTER] Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};

// (Optional) Get user info by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['user_id', 'username', 'email', 'created_at', 'login_id'],
      include: [{ model: Login, include: [{ model: Role, attributes: ['role_name'] }] }]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
