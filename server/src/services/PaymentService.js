const bcrypt = require("bcryptjs");
const db = require("../models/index");
const pool = require("../config/connectDBWithQuery");
const { Op } = require("@sequelize/core");
// const moment = require("moment");
require("dotenv").config();

let createNew = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createNew = await db.Payment.create({
        id: data.id,
        Oder_TotalPrice: data.Oder_TotalPrice,
        UserID: data.UserID,
      });
      if (createNew) {
        resolve({
          status: "OK",
          message: "Create successful",
          data: createNew,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetail = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await db.Payment.findOne({
        where: { id: data },
      });
      if (payment) {
        resolve({
          status: "OK",
          message: "getDetail successful",
          data: payment,
        });
      } else {
        resolve({
          status: "OK",
          message: "Empty",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAll = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const payments = await db.Payment.findAll();
      if (payments) {
        resolve({
          status: "OK",
          message: "getAll successful",
          data: payments,
        });
      } else {
        resolve({
          status: "OK",
          message: "Empty",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateObj = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await db.Payment.findOne({
        where: { id: data.id },
      });

      if (payment) {
        payment.Payment_Date = data.Payment_Date;
        payment.Payment_Method = data.Payment_Method;
        payment.ShoppingCartID = data.ShoppingCartID;
        payment.UserID = data.UserID;
        payment.save();
        resolve({
          status: "OK",
          message: "update successful",
          data: payment,
        });
      } else {
        resolve({
          status: "OK",
          message: "Empty",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteObj = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payment = await db.Payment.findOne({
        where: { id: data.id },
      });
      if (payment) {
        payment.destroy();
        resolve({
          status: "OK",
          message: "delete successful",
        });
      } else {
        resolve({
          status: "OK",
          message: "Empty",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
// Zalo Pay =====================================================================
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const createPayment = async (body) => {
  console.log("createPayment", body);
  const embed_data = {
    redirecturl: "http://localhost:3000/", // link chuyển hướng sau thanh toán
  };

  const items = [{ oderID: "1" }];
  const order = {
    app_id: config.app_id,
    app_trans_id: body.app_trans_id,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: body.Oder_TotalPrice,
    description: `Lazada - Payment for the order #${body.app_trans_id}`,
    bank_code: "",
    callback_url: `https://6903-2001-ee0-55ac-1c30-2058-4e3b-4f7d-cacc.ngrok-free.app`, //post 55009
  };
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  try {
    const response = await axios.post(config.endpoint, null, { params: order });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const handleCallback = (body) => {
  console.log("handleCallback", body);

  let result = {};
  try {
    const dataStr = body.data;
    const reqMac = body.mac;
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
      console.log("first mac not equal");
    } else {
      const dataJson = JSON.parse(dataStr);
      console.log(
        `UPDATE users SET money = 100000 WHERE email = ${dataJson["email"]}`
      );

      pool.execute(
        `UPDATE users SET money = 100000 WHERE email = ${dataJson["email"]}`
      );
      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0;
    result.return_message = ex.message;
  }
  return result;
};

const getOrderStatus = async (app_trans_id) => {
  const postData = {
    app_id: config.app_id,
    app_trans_id,
  };

  const data =
    postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  const postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const response = await axios(postConfig);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Zalo Pay =====================================================================

module.exports = {
  createNew,
  getDetail,
  getAll,
  updateObj,
  deleteObj,
  getOrderStatus,
  handleCallback,
  createPayment,
};
