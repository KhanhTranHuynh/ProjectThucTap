const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Thiếu thông tin." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // hoặc smtp khác
      auth: {
        user: "khanhtranhuynh9@gmail.com", // email admin
        pass: "ggss rkco vtoo mxnr", // hoặc app password
      },
    });

    const mailOptions = {
      from: email,
      to: "khanhtranhuynh9@gmail.com", // email admin
      subject: `Liên hệ từ ${name}`,
      text: `Người gửi: ${name}\nEmail: ${email}\n\nNội dung:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Lỗi gửi mail:", error);
    res.status(500).json({ error: "Không gửi được email." });
  }
};

module.exports = { sendEmail };
