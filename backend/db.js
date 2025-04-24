// db.js with Promises
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const db = await mysql.createConnection({
  host: process.env.DB_HOST,        // Database host
  user: process.env.DB_USER,        // Database user
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME,     // Database name
});

// Test the connection
try {
  await db.connect();
  console.log("✅ Database connected successfully");
} catch (err) {
  console.error("❌ Database connection failed:", err);
}