const express = require("express");
const router = express.Router();
const Controller = require("../controllers/PaymentController");

router.post("/deposit", Controller.deposit);

module.exports = router;
