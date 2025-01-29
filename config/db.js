const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: process.env.PASSWORD_DB,
  database: "school",
});

db.connect((err) => {
  if (err) {
    console.error("Error With Connect To Database", err);
    return;
  }
  console.log("Connection Successfully MySQL");
});

module.exports = db;
