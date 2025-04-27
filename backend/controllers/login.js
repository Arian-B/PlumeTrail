import { sequelize } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { Login, User, Role } = sequelize.models;

// User login
export const login = async (req, res) => {
  try {
    // Accept both {username, password} and {login_username, password} from frontend
    const login_username = req.body.login_username || req.body.username;
    const password = req.body.password;
    console.log('[LOGIN] Received login_username:', login_username, 'password:', typeof password === 'string' ? '[HIDDEN]' : password);
    if (!login_username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    // Find the login record
    const login = await Login.findOne({
      where: { login_username },
      include: [{ model: Role, attributes: ['role_name', 'permission_type'] }]
    });
    if (!login) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, login.user_password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Find the user record
    const user = await User.findOne({ where: { login_id: login.login_id } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Generate JWT token
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: login.Role.role_name,
        permission: login.Role.permission_type
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
