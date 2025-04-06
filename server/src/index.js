const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

require("dotenv").config();
const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Init Connect Database================================
const connectDB = require("./config/connectDB");
connectDB();

//Init Web Route=======================================
const initWebroute = require("./route/index");
initWebroute(app);

app.listen(port, () => {
  console.log("Server run with port " + port);
});
