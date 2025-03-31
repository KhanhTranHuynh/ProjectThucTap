const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "30012003",
  database: "tot_nghiep",
});

module.exports = pool;
