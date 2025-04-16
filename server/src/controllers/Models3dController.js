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
const { spawn, exec } = require("child_process");

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

const upload = async (req, res) => {
  try {
    console.log("first");
    if (!req.file) {
      console.log("first");
      return res
        .status(400)
        .json({ status: "ERROR", message: "No video file uploaded" });
    }

    const videoPath = req.file.path;
    console.log("Video path:", videoPath);

    const uploadId = Date.now().toString();
    uploadStatus[uploadId] = { status: "processing", result: null };

    const videoFilename = req.file.filename;

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
      `ffmpeg -i "${videoPath}" -vf "fps=1" -q:v 1 "${imagesDir}\\%04d.jpg"`
    );

    const openMvgBin = "P:\\WebLuanVan\\openMVG\\bin";
    const openMvsBin = "P:\\WebLuanVan\\openMVS\\bin";

    const sfmDataJson = path.join(sfmDir, "sfm_data.json");
    const sfmDataBin = path.join(reconstructionDir, "sfm_data.bin");
    const sceneMvs = path.join(sfmDir, "scene.mvs");
    const dense_scene = path.join(sfmDir, "dense_scene.ply");

    const reconstructMeshOutput = path.join(sfmDir, "mesh.ply");
    const refineMeshOutput = path.join(sfmDir, "mesh_refined.ply");
    const textureMeshOutput = path.join(
      sfmDir,
      `${videoFilename.replace(/\.mp4$/, "")}.ply`
    );

    const openMvgCommands = [
      `"${openMvgBin}\\openMVG_main_SfMInit_ImageListing.exe" -i ${imagesDir} -o ${sfmDir} -f 600`,
      `"${openMvgBin}\\openMVG_main_ComputeFeatures.exe" -i ${sfmDataJson} -o ${sfmDir} -p ULTRA`,
      `"${openMvgBin}\\openMVG_main_ComputeMatches.exe" -i ${sfmDataJson} -o ${sfmDir} -r 1`,
      `"${openMvgBin}\\openMVG_main_IncrementalSfM.exe" -i ${sfmDataJson} -m ${sfmDir} -o ${reconstructionDir}`,
      `"${openMvgBin}\\openMVG_main_openMVG2openMVS.exe" -i ${sfmDataBin} -o "${sceneMvs}"`,
      `"${openMvsBin}\\DensifyPointCloud.exe" "${sceneMvs}" -o "${dense_scene}"`,
      `"${openMvsBin}\\ReconstructMesh.exe" -i "${sceneMvs}" -o "${reconstructMeshOutput}"`,
      `"${openMvsBin}\\RefineMesh.exe" --input-file "${sceneMvs}" --mesh-file "${reconstructMeshOutput}" -o "${refineMeshOutput}"`,
      `"${openMvsBin}\\TextureMesh.exe" --input-file "${sceneMvs}" --mesh-file "${refineMeshOutput}" -o "${textureMeshOutput}"`,
    ];

    for (const cmd of openMvgCommands) {
      await runCommand(cmd);
    }

    deleteUndistortedImagesFolder();
    deleteAllLogAndDmapFilesInDirectory("P:/WebLuanVan/server");

    copyFile(
      `O:/${videoFilename.replace(/\.mp4$/, "")}/sfm/${videoFilename.replace(
        /\.mp4$/,
        ""
      )}.ply`,
      `P:/WebLuanVan/client/public/plys/${videoFilename.replace(
        /\.mp4$/,
        ""
      )}.ply`
    );

    copyFile(
      `O:/${videoFilename.replace(/\.mp4$/, "")}/sfm/${videoFilename.replace(
        /\.mp4$/,
        ""
      )}0.png`,
      `P:/WebLuanVan/client/public/png/${videoFilename.replace(
        /\.mp4$/,
        ""
      )}0.png`
    );

    const plyFilename = videoFilename.replace(/\.mp4$/, ".ply");

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

    res.status(200).json("okok");
  } catch (error) {
    console.error("Lỗi tổng quát trong quá trình upload:", error.message);
    res.status(500).json({
      status: "ERROR",
      message: "Upload and processing failed",
      error: error.message,
    });
  }
};

async function copyFile(source, destination) {
  try {
    await fs.copyFile(source, destination);
  } catch (err) {
    console.error(err);
  }
}

async function deleteAllLogAndDmapFilesInDirectory(logDir) {
  try {
    const files = await fs.readdir(logDir);
    const targetFiles = files.filter(
      (file) => file.endsWith(".log") || file.endsWith(".dmap")
    );

    if (targetFiles.length === 0) {
      return;
    }

    for (const file of targetFiles) {
      const filePath = path.join(logDir, file);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteUndistortedImagesFolder() {
  const folderPath = path.join(__dirname, "..", "..", "undistorted_images");

  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log("Đã xóa folder undistorted_images thành công");
  } catch (err) {
    console.error("Lỗi khi xóa folder undistorted_images:", err.message);
  }
}

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
