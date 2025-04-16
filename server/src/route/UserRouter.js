const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.get("/getUser", userController.getUser);
router.get("/getemailwithtoken", userController.getemailwithtoken);

router.get("/getAllUser", userController.getAllUser);

router.get("/getUserRole", userController.getUserRole);

router.post("/loginUser", userController.loginUser);

module.exports = router;
