const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const pool = require("../config/connectDBWithQuery");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginUser = async (req, res) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Thiếu Google Token" });
    }

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let [user] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      await pool.execute(
        "INSERT INTO users (email, name, money) VALUES (?, ?, 0)",
        [email, name]
      );
      user = [{ email: email, name: name }];
    }

    const token = jwt.sign({ email: email }, "SECRET_KEY", {
      expiresIn: "3h",
    });

    return res
      .status(200)
      .json({ status: "OK", message: "Đăng nhập thành công", token, user });
  } catch (e) {
    e;
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    let [user] = await pool.execute("SELECT * FROM users ");
    return res.status(200).json({ status: "OK", data: user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const getUser = async (req, res) => {
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
    return res.status(200).json({ status: "OK", user: payload });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const getemailwithtoken = async (req, res) => {
  try {
    const googleToken = req.query.token; // Lấy token từ query string
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload().email;
    return res.status(200).json({ payload });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: "ERR", message: e.message });
  }
};

const getUserRole = async (req, res) => {
  const { token } = req.query;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  try {
    const [rows] = await pool.execute(
      "SELECT role FROM users WHERE email = ?",
      [payload.email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRole = rows[0].role;
    return res.status(200).json({ role: userRole });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllWithToKen = async (req, res) => {
  const { token } = req.query;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      payload.email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updateRole = async (req, res) => {
  try {
    const { role } = req.body; // Role from request body
    const { email } = req.params; // Email from URL path

    // Validate input
    if (!role || !email) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "Role and email are required" });
    }

    // Execute the update query
    const [result] = await pool.execute(
      "UPDATE users SET role = ? WHERE email = ?",
      [role, email]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: "ERROR", message: "User not found" });
    }

    // Return success response
    return res.status(200).json({ status: "OK", data: { email, role } });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res
      .status(500)
      .json({ status: "ERROR", message: "Internal server error" });
  }
};

module.exports = {
  getUser,
  getAllUser,
  loginUser,
  getUserRole,
  getemailwithtoken,
  getAllWithToKen,
  updateRole,
};
