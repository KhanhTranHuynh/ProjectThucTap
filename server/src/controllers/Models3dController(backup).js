const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const pool = require("../config/connectDBWithQuery");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const fsSync = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const uploadStatus = {};

const getWithIdUser = async (req, res) => {
  try {
    let [obj] = await pool.execute(
      "SELECT * FROM models3d WHERE users_id = ?",
      [1]
    );
    return res.status(200).json({ status: "OK", data: obj });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

async function convertPlyFileWithStream(sourcePath, destPath) {
  try {
    const destDir = path.dirname(destPath);
    await fs.mkdir(destDir, { recursive: true });

    return new Promise((resolve, reject) => {
      const readStream = fsSync.createReadStream(sourcePath);
      const writeStream = fsSync.createWriteStream(destPath);

      readStream.on("error", (error) => {
        console.error("Lỗi khi đọc file:", error);
        reject(error);
      });

      writeStream.on("error", (error) => {
        console.error("Lỗi khi ghi file:", error);
        reject(error);
      });

      writeStream.on("finish", () => {
        `công thành ${path.basename(destPath)}`;
        resolve();
      });

      readStream.pipe(writeStream);
    });
  } catch (error) {
    console.error("Lỗi trong quá trình sao chép:", error);
    throw error;
  }
}

const upload = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "No video file uploaded" });
    }

    const videoPath = req.file.path;

    const videoInfo = await getVideoInfo(videoPath);
    const duration = videoInfo.duration;
    const width = videoInfo.width;
    const height = videoInfo.height;

    if (duration != 40) {
      await fs.unlink(videoPath);
      return res.status(400).json({
        status: "ERROR",
        message: "ERROR",
      });
    }

    if (width != 600 || height != 338) {
      await fs.unlink(videoPath);
      return res.status(400).json({
        status: "ERROR",
        message: "ERROR",
      });
    }

    const uploadId = Date.now().toString();
    uploadStatus[uploadId] = { status: "processing", result: null };

    const videoFilename = req.file.filename;
    const plyFilename = videoFilename.replace(/\.mp4$/, ".ply");

    const sourcePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "client",
      "public",
      "logo",
      "default.ply"
    );
    const destDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "client",
      "public",
      "plys"
    );
    const destPath = path.join(destDir, plyFilename);

    await convertPlyFileWithStream(sourcePath, destPath);

    let [obj] = await pool.execute(
      "INSERT INTO models3d (users_id, link_video, link_3d) VALUES (?, ?, ?)",
      [req.body.users_id || 1, videoFilename, plyFilename]
    );

    const result = {
      key: obj.insertId,
      id: obj.insertId,
      users_id: req.body.users_id || 1,
      link_video: videoFilename,
      link_3d: plyFilename,
      status: "OK",
      message: "File copied successfully",
      data: obj,
      link_video_full: `/uploads/${videoFilename}`,
      link_3d_full: `/public/plys/${plyFilename}`,
    };

    uploadStatus[uploadId] = { status: "completed", result };

    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi trong quá trình upload:", error);
    res.status(500).json({ status: "ERROR", message: "Upload failed" });
  }
};

const getVideoInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const duration = metadata.format.duration; // Thời gian video (giây)
      const videoStream = metadata.streams.find(
        (s) => s.codec_type === "video"
      );
      const width = videoStream.width;
      const height = videoStream.height;
      resolve({ duration, width, height });
    });
  });
};

const checkUploadStatus = async (req, res) => {
  const { uploadId } = req.params;
  const status = uploadStatus[uploadId];

  if (!status) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "Upload not found" });
  }

  res.status(200).json(status);

  if (status.status === "completed" || status.status === "failed") {
    delete uploadStatus[uploadId];
  }
};

module.exports = {
  getWithIdUser,
  upload,
  checkUploadStatus,
};
