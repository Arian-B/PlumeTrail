// db.js with Promises
import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "34783478",
  database: "plumetrail",
});
