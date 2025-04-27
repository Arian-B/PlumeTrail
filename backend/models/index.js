// Sequelize initialization and model associations for PlumeTrail
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Test DB connection with robust error handling
(async () => {
  try {
    await sequelize.authenticate();
    console.log('[Sequelize] Database connection established successfully.');
  } catch (error) {
    console.error('[Sequelize] Unable to connect to the database:', error);
    // Do NOT call process.exit(); just log the error
  }
})();

// Import models
defineModels(sequelize);

// Model definitions
function defineModels(sequelize) {
  // User Model
  const User = sequelize.define('User', {
    user_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: Sequelize.STRING(50), allowNull: false },
    password: { type: Sequelize.STRING(255), allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    login_id: { type: Sequelize.INTEGER, allowNull: false },
    email: { type: Sequelize.STRING(255) },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  // Login Model
  const Login = sequelize.define('Login', {
    login_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    login_role_id: { type: Sequelize.INTEGER, allowNull: false },
    login_username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    user_password: { type: Sequelize.STRING(255), allowNull: false },
  }, {
    tableName: 'login',
    timestamps: false,
  });

  // Role Model
  const Role = sequelize.define('Role', {
    role_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    role_name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    role_desc: { type: Sequelize.TEXT },
    permission_type: { type: Sequelize.STRING(50) },
  }, {
    tableName: 'roles',
    timestamps: false,
  });

  // BlogCategory Model
  const BlogCategory = sequelize.define('BlogCategory', {
    bc_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    bc_title: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    bc_type: { type: Sequelize.STRING(50) },
    bc_desc: { type: Sequelize.TEXT },
    bc_content: { type: Sequelize.TEXT },
    user_id: { type: Sequelize.INTEGER, allowNull: false },
  }, {
    tableName: 'blog_category',
    timestamps: false,
  });

  // Blog Model
  const Blog = sequelize.define('Blog', {
    blog_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    blog_title: { type: Sequelize.STRING(255), allowNull: false },
    blog_content: { type: Sequelize.TEXT, allowNull: false },
    blog_author_id: { type: Sequelize.INTEGER, allowNull: false },
    category_id: { type: Sequelize.INTEGER },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    comments_count: { type: Sequelize.INTEGER, defaultValue: 0 },
    img: { type: Sequelize.STRING(255) },
  }, {
    tableName: 'blog',
    timestamps: false,
  });

  // Comment Model
  const Comment = sequelize.define('Comment', {
    comm_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    comm_user_id: { type: Sequelize.INTEGER, allowNull: false },
    comm_blog_id: { type: Sequelize.INTEGER, allowNull: false },
    content: { type: Sequelize.TEXT, allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  }, {
    tableName: 'comments',
    timestamps: false,
  });

  // Associations
  User.hasMany(Blog, { foreignKey: 'blog_author_id' });
  Blog.belongsTo(User, { foreignKey: 'blog_author_id' });

  BlogCategory.hasMany(Blog, { foreignKey: 'category_id' });
  Blog.belongsTo(BlogCategory, { foreignKey: 'category_id' });

  User.hasMany(BlogCategory, { foreignKey: 'user_id' });
  BlogCategory.belongsTo(User, { foreignKey: 'user_id' });

  Blog.hasMany(Comment, { foreignKey: 'comm_blog_id' });
  Comment.belongsTo(Blog, { foreignKey: 'comm_blog_id' });

  User.hasMany(Comment, { foreignKey: 'comm_user_id' });
  Comment.belongsTo(User, { foreignKey: 'comm_user_id' });

  Login.belongsTo(Role, { foreignKey: 'login_role_id' });
  Role.hasMany(Login, { foreignKey: 'login_role_id' });

  User.belongsTo(Login, { foreignKey: 'login_id' });
  Login.hasOne(User, { foreignKey: 'login_id' });

  // Export models
  sequelize.models = { User, Login, Role, Blog, BlogCategory, Comment };
}

export { sequelize };
