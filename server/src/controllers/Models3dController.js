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

const upload = async (req, res) => {
  console.log(req.body.timestamp);
  copyFile(
    `P:/WebLuanVan/client/public/plys/mesh_textured.ply`,
    `P:/WebLuanVan/client/public/plys/${req.body.timestamp}.ply`
  );
  copyFile(
    `P:/WebLuanVan/client/public/png/mesh_textured0.png`,
    `P:/WebLuanVan/client/public/png/${req.body.timestamp}0.png`
  );
  await pool.execute(
    "INSERT INTO models3d (users_email, link_video, link_3d) VALUES (?, ?, ?)",
    [
      "khanhtranhuynh9@gmail.com",
      `${req.body.timestamp}.mp4`,
      `${req.body.timestamp}.ply`,
    ]
  );
};

async function copyFile(source, destination) {
  try {
    await fs.copyFile(source, destination);
  } catch (err) {
    console.error(err);
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
