const mysql = require("mysql2");
require("dotenv").config();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD_DB,
  database: "school",
});

db.connect((err) => {
  if (err) {
    console.error("خطأ في الاتصال بقاعدة البيانات:", err);
    return;
  }
  console.log("تم الاتصال بنجاح بقاعدة البيانات MySQL");
});

module.exports = db;
