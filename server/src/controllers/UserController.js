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

module.exports = {
  getUser,
  loginUser,
};
