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

const deposit = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 1000) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "Số tiền không hợp lệ" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "vnd",
      payment_method_types: ["card"],
    });
    res.json({ status: "OK", clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};

module.exports = {
  deposit,
};
