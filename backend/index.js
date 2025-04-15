import express from 'express';
import loginRoutes from './routes/login.js';         // Renamed from auth.js
import userRoutes from './routes/user.js';           // Renamed from users.js
import blogRoutes from './routes/blog.js';           // Renamed from posts.js
import blogCategoryRoutes from './routes/blogCategory.js';  // Newly added
import commentRoutes from './routes/comment.js';    // Newly added
import cookieParser from 'cookie-parser';
import multer from 'multer';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Multer storage config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload');  // Correct path relative to the backend
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

// File upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).json({ filename: file.filename });
});

// Routes
app.use('/api/login', loginRoutes);  // Renamed to /api/login
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);    // Renamed to /api/blog
app.use('/api/blogCategory', blogCategoryRoutes);  // Added blogCategory routes
app.use('/api/comments', commentRoutes);  // Added comment routes

// Start server
app.listen(8800, () => {
  console.log('✅ Server is running on http://localhost:8800');
});
