<<<<<<< HEAD

# PlumeTrail

**PlumeTrail, a modern blogging platform for teenagers and individualists.**

---

## Features
- Create, edit, and delete blog posts
- Rich text editing with image support
- User authentication (JWT-based)
- Categories for organizing blogs
- Responsive, clean UI
- MySQL database with Sequelize ORM

## Tech Stack
- **Frontend:** React, React Router, Axios, React Quill, Sass
- **Backend:** Node.js, Express, Sequelize, JWT, MySQL

## Folder Structure
```
PlumeTrail/
  frontend/    # React app (client)
  backend/     # Express API (server)
  README.md
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MySQL](https://www.mysql.com/) server

### 1. Clone the Repository
```
git clone <your-repo-url>
cd PlumeTrail
```

### 2. Setup the Database
- Create a MySQL database (e.g. `plumetrail`).
- Import or create the required tables (see `/backend/models` for structure).

### 3. Configure Environment Variables
- In `/backend`, create a `.env` file:
  ```env
  DB_HOST=localhost
  DB_USER=your_mysql_user
  DB_PASSWORD=your_mysql_password
  DB_NAME=plumetrail
  JWT_SECRET=your_jwt_secret
  ```
- Adjust as needed for your setup.

### 4. Install Dependencies
#### Frontend
```
cd frontend
npm install
```
#### Backend
```
cd ../backend
npm install
```

### 5. Run the App
#### Start Backend
```
npm run dev
```
#### Start Frontend
```
cd ../frontend
npm start
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5050](http://localhost:5050)

## Usage
- Register a new account, log in, and start blogging!
- Only authors can edit/delete their own blogs.

## License
This project is for educational purposes.

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# PlumeTrail

A modern blogging platform for teenagers and individualists.

> > > > > > > ea585c416fee10b1cb34a18ec6189293ae59260c
