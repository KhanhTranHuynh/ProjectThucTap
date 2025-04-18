const express = require("express");
const router = express.Router();
const SendEmailController = require("../controllers/SendEmailController");

router.post("/sendEmail", SendEmailController.sendEmail);

module.exports = router;
