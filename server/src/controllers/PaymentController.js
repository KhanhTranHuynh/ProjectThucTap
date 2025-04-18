const Service = require("../services/PaymentService");

const createNew = async (req, res) => {
  try {
    const response = await Service.createNew(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetail = async (req, res) => {
  try {
    const response = await Service.getDetail(req.query.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const response = await Service.getAll();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateObj = async (req, res) => {
  try {
    const response = await Service.updateObj(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteObj = async (req, res) => {
  try {
    const response = await Service.deleteObj(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// Payment Zalo=====================================
const createPayment = async (req, res) => {
  try {
    const response = await Service.createPayment(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const callback = (req, res) => {
  const result = Service.handleCallback(req.body);
  res.json(result);
};

const orderStatus = async (req, res) => {
  try {
    const response = await Service.getOrderStatus(req.body.app_trans_id);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Payment Zalo=====================================

module.exports = {
  createNew,
  getDetail,
  getAll,
  updateObj,
  deleteObj,
  createPayment,
  callback,
  orderStatus,
};
