const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "../Client/public/images/products"); // Thư mục lưu trữ ảnh
    cb(null, "../Client/public/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file với timestamp
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
