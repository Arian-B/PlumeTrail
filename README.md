# 🌟 PlumeTrail

<div align="center">

![PlumeTrail Banner](https://via.placeholder.com/800x200/2D3748/FFFFFF?text=PlumeTrail)

*A modern blogging platform for teenagers and individualists*

[![React](https://img.shields.io/badge/React-18.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

## ✨ Features

- 📝 **Rich Text Editor** - Create beautiful blog posts with image support
- 🔐 **Secure Authentication** - JWT-based user authentication
- 🏷️ **Category System** - Organize your blogs with custom categories
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🗄️ **Robust Database** - MySQL with Sequelize ORM for reliable data storage

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router
- Axios
- React Quill
- Sass

### Backend
- Node.js
- Express
- Sequelize ORM
- JWT Authentication
- MySQL

## 📁 Project Structure

```
PlumeTrail/
├── frontend/          # React application
│   ├── src/          # Source files
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
│
├── backend/          # Express API server
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── package.json  # Backend dependencies
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- Git

### Installation

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd PlumeTrail
   ```

2. **Database Setup**
   - Create a MySQL database named `plumetrail`
   - Import the database schema from `/backend/models`

3. **Environment Configuration**
   Create a `.env` file in the `/backend` directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=plumetrail
   JWT_SECRET=your_jwt_secret
   ```

4. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

5. **Run the Application**
   ```bash
   # Start Backend (from backend directory)
   npm run dev

   # Start Frontend (from frontend directory)
   npm start
   ```

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5050](http://localhost:5050)

## 📝 Usage

1. Register a new account
2. Log in to your account
3. Create your first blog post
4. Add categories to organize your content
5. Edit or delete your posts as needed

## 🔒 Security

- JWT-based authentication
- Password hashing
- Protected routes
- User-specific content management

## 📚 Documentation

- [React Documentation](https://reactjs.org/)
- [Express Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by the PlumeTrail Team
</div>
