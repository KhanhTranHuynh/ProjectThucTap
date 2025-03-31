const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../models/index");

dotenv.config();

const AuthMiddleWareAdminRole = (req, res, next) => {
  const token = req.headers.token;
  try {
    if (token === "Admin") {
      next();
    } else {
      return res.status(200).json({
        status: "ERR",
        message: "The authMiddleWare",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: "The authMiddleWare",
    });
  }
};

const AuthMiddleWareAdminStaffRole = (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, users) {
    if (err) {
      return res.status(404).json({
        status: "ERR",
        message: "The authMiddleWare",
      });
    }
    if (users?.User_Role === "Admin" || users?.User_Role === "Staff") {
      next();
    } else {
      return res.status(404).json({
        status: "ERR",
        message: "The authMiddleWare",
      });
    }
  });
};

const AuthMiddleWareCheckLogin = (req, res, next) => {
  const token = req.headers.token;
  jwt.verify(token, process.env.ACCESS_TOKEN, async function (err, users) {
    if (err) {
      return res.status(404).json({
        status: "ERR",
        message: "The authMiddleWare",
      });
    }
    if (users) {
      next();
    } else {
      return res.status(404).json({
        status: "ERR",
        message: "The authMiddleWare",
      });
    }
  });
};

module.exports = {
  AuthMiddleWareAdminRole,
  AuthMiddleWareAdminStaffRole,
  AuthMiddleWareCheckLogin,
};
