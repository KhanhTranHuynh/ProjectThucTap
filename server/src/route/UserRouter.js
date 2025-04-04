const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.get("/getUser", userController.getUser);

router.post("/loginUser", userController.loginUser);

module.exports = router;
