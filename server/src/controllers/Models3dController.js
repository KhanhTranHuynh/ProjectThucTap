const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const pool = require("../config/connectDBWithQuery");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const fsSync = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { config } = require("dotenv");
const { clearScreenDown } = require("readline");
const uploadStatus = {};
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { spawn } = require("child_process");

const getModel = async (req, res) => {
  try {
    let [obj] = await pool.execute("SELECT * FROM models3d ");

    return res.status(200).json({ status: "OK", data: obj });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const getWithIdUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "ERR", message: "Unauthorized" });
    }

    const googleToken = authHeader.split(" ")[1];

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let [obj] = await pool.execute(
      "SELECT * FROM models3d WHERE users_email = ?",
      [email]
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
        console.log(`thành công ${path.basename(destPath)}`);
        resolve();
      });

      readStream.pipe(writeStream);
    });
  } catch (error) {
    console.error("Lỗi quá trình:", error);
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
    console.log("Video path:", videoPath);

    const uploadId = Date.now().toString();
    uploadStatus[uploadId] = { status: "processing", result: null };

    const videoFilename = req.file.filename;
    const plyFilename = videoFilename.replace(/\.mp4$/, ".ply");
    console.log("Video filename:", videoFilename);

    const baseDir = `O:\\${videoFilename.split(".")[0]}`;
    const imagesDir = path.join(baseDir, "images");
    const sfmDir = path.join(baseDir, "sfm");
    const reconstructionDir = path.join(sfmDir, "reconstruction");
    console.log("Base directory:", baseDir);

    const runCommand = (cmd) => {
      return new Promise((resolve) => {
        console.log(`Bắt đầu chạy lệnh: ${cmd}`);
        const process = spawn(cmd, { shell: true, windowsHide: false });
        process.stdout.on("data", (data) => console.log(`Output: ${data}`));
        process.stderr.on("data", (data) => console.error(`Error: ${data}`));
        process.on("close", (code) => {
          console.log(`Lệnh "${cmd}" hoàn thành với code ${code}`);
          resolve(code);
        });
      });
    };

    await runCommand(`mkdir "${baseDir}"`);
    await runCommand(`mkdir "${imagesDir}"`);
    await runCommand(
      `ffmpeg -i "${videoPath}" -vf "fps=5" -q:v 1 "${imagesDir}\\%04d.jpg"`
    );

    const openMvgBin = "P:\\WebLuanVan\\openMVG_openMVS\\bin";
    const sfmDataJson = path.join(sfmDir, "sfm_data.json");
    const sfmDataBin = path.join(reconstructionDir, "sfm_data.bin");
    const sceneMvs = path.join(sfmDir, "scene.mvs");

    const openMvgCommands = [
      `"${openMvgBin}\\openMVG_main_SfMInit_ImageListing.exe" -i ${imagesDir} -o ${sfmDir} -f 600`,
      `"${openMvgBin}\\openMVG_main_ComputeFeatures.exe" -i ${sfmDataJson} -o ${sfmDir} -p ULTRA`,
      `"${openMvgBin}\\openMVG_main_ComputeMatches.exe" -i ${sfmDataJson} -o ${sfmDir} -r 1`, // Đã sửa lỗi từ sfmDataBinaryJson
      `"${openMvgBin}\\openMVG_main_IncrementalSfM.exe" -i ${sfmDataJson} -m ${sfmDir} -o ${reconstructionDir}`,
      `"${openMvgBin}\\openMVG_main_openMVG2openMVS.exe" -i ${sfmDataBin} -o "${sceneMvs}"`,
    ];

    for (const cmd of openMvgCommands) {
      await runCommand(cmd);
    }

    let isVideoValid = false;
    let warnings = [];
    try {
      const videoInfo = await getVideoInfo(videoPath);
      const duration = videoInfo.duration;
      const width = videoInfo.width;
      const height = videoInfo.height;

      isVideoValid = duration === 40 && width === 600 && height === 338;
      if (duration !== 40) warnings.push(`ERROR`);
      if (width !== 600 || height !== 338) warnings.push(`ERROR`);
    } catch (error) {
      console.error("ERROR", error.message);
      warnings.push("ERROR");
    }

    let result = {};
    if (isVideoValid) {
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

      try {
        await fs.mkdir(destDir, { recursive: true });
        await convertPlyFileWithStream(sourcePath, destPath);
      } catch (error) {
        console.error("Lỗi khi tạo file .ply:", error.message);
        warnings.push("Failed to tạo .ply file");
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ status: "ERR", message: "Unauthorized" });
      }

      const googleToken = authHeader.split(" ")[1];
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const email = payload.email;

      let obj;
      try {
        [obj] = await pool.execute(
          "INSERT INTO models3d (users_email, link_video, link_3d) VALUES (?, ?, ?)",
          [email, videoFilename, plyFilename]
        );
      } catch (error) {
        console.error("Lỗi khi lưu vào DB:", error.message);
        warnings.push("Failed to save to database");
      }

      result = {
        key: obj?.insertId || null,
        id: obj?.insertId || null,
        users_id: req.body.users_id || 1,
        link_video: videoFilename,
        link_3d: plyFilename,
        status: "OK",
        message: "File processed successfully",
        data: obj || null,
        link_video_full: `/uploads/${videoFilename}`,
        link_3d_full: `/public/plys/${plyFilename}`,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } else {
      result = {
        status: "WARNING",
        message: "Video processed but not valid for .ply generation",
        link_video: videoFilename,
        warnings,
      };
    }

    uploadStatus[uploadId] = { status: "completed", result };
    deleteUndistortedImagesFolder();
    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi tổng quát trong quá trình upload:", error.message);
    res.status(500).json({
      status: "ERROR",
      message: "Upload and processing failed",
      error: error.message,
    });
  }
};

async function deleteUndistortedImagesFolder() {
  const folderPath = path.join(__dirname, "..", "..", "undistorted_images");

  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log("Đã xóa folder undistorted_images thành công");
  } catch (err) {
    console.error("Lỗi khi xóa folder undistorted_images:", err.message);
  }
}

const getVideoInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const duration = metadata.format.duration;
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
  getModel,
};
