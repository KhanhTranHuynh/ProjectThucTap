const express = require("express");
const router = express.Router();
const Controller = require("../controllers/PaymentController");

router.post("/addnew", Controller.createNew);

router.get("/getDetail", Controller.getDetail);
router.get("/getAll", Controller.getAll);

router.put("/updateObj", Controller.updateObj);

router.delete("/deleteObj", Controller.deleteObj);

router.post("/paymentZalo", Controller.createPayment);
router.post("/callback", Controller.callback);
router.post("/order-status", Controller.orderStatus);

module.exports = router;
