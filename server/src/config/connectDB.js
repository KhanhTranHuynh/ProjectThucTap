const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: "tot_nghiep",
  username: "root",
  password: "30012003",
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    ("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectDB;
