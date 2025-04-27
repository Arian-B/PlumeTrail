import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import './models/index.js';

import blogRoutes from './routes/blog.js';
import blogCategoryRoutes from './routes/blogCategory.js';
import commentRoutes from './routes/comment.js';
import loginRoutes from './routes/login.js';
import userRoutes from './routes/user.js';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Global request logger
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.use('/api/blogs', blogRoutes);
app.use('/api/categories', blogCategoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.json({ message: 'Welcome to the PlumeTrail Blogging API!' }));

const PORT = 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
