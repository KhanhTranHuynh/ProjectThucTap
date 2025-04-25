require("dotenv").config();
const pool = require("../config/connectDBWithQuery");

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM settings");
    const result = {};
    rows.forEach((s) => {
      result[s.setting_key] = s.setting_value;
    });
    res.json(result);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTable = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM settings");

    res.json(rows);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  const { id, setting_value } = req.body;
  try {
    await pool.execute("UPDATE settings SET setting_value = ? WHERE id = ?", [
      setting_value,
      id,
    ]);
    res.json({ status: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "ERROR", message: "Lỗi khi cập nhật" });
  }
};

const upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    // Insert the URL into the database using pool

    await pool.execute("UPDATE settings SET setting_value = ? WHERE id = 2", [
      `/logo/${req.file.filename}`,
    ]);

    res.json({ message: "ok" });
  } catch (error) {
    console.error("Error saving URL to database:", error);
    return res.status(500).json({ message: "Failed to save URL to database" });
  }
};

module.exports = {
  getAll,
  getTable,
  update,
  upload,
};
