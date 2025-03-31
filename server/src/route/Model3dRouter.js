const express = require("express");
const router = express.Router();
const Controller = require("../controllers/Models3dController");
const upload = require("../middleware/uploadMiddleware");

router.get("/getWithIdUser", Controller.getWithIdUser);
router.post("/upload", upload.single("video"), Controller.upload);
router.get("/upload-status/:uploadId", Controller.checkUploadStatus);

module.exports = router;
