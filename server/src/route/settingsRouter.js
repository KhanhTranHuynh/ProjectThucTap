const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadConfig");
const userController = require("../controllers/SettingController");

router.get("/getAll", userController.getAll);
router.get("/getTable", userController.getTable);
router.put("/update", userController.update);

router.post("/upload", upload.single("image"), userController.upload);

module.exports = router;
