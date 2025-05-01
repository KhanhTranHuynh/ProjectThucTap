const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Tạo HTTP server

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Init Connect Database================================
const connectDB = require("./config/connectDB");
const db = require("./models/index"); // Import models
connectDB();

//Init Web Route=======================================
const initWebroute = require("./route/index");
initWebroute(app);

// Thiết lập Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Socket.IO Logic
io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);

    db.Message.findAll({ where: { conversationId: room } }).then((text) => {
      socket.emit("load_messages", text);
    });
  });

  socket.on("send_message", async (data) => {
    try {
      const { conversationId, text, senderID } = data;

      const conversationIds = await db.Message.findAll({
        attributes: [
          [
            db.Sequelize.fn("DISTINCT", db.Sequelize.col("conversationId")),
            "conversationId",
          ],
        ],
      });

      const conversationsArray = conversationIds.map(
        (conv) => conv.conversationId
      );

      if (!conversationsArray.includes(conversationId)) {
        conversationsArray.push(conversationId);
      }

      await db.Message.create({
        conversationId,
        senderID,
        text,
      });

      io.emit("update_conversations", conversationsArray);

      io.to(conversationId).emit("receive_message", {
        senderID,
        text,
        time: new Date(),
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("get_conversations", async (callback) => {
    try {
      const conversationsArray = await db.Message.findAll({
        attributes: [
          [
            db.Sequelize.fn("DISTINCT", db.Sequelize.col("conversationId")),
            "conversationId",
          ],
        ],
      });

      const conversationIds = conversationsArray.map(
        (conv) => conv.conversationId
      );

      callback({ status: "success", data: conversationIds });
    } catch (error) {
      callback({
        status: "error",
        message: "Không thể lấy danh sách conversations",
      });
    }
  });

  socket.on("disconnect", () => {});
});

// Start Server
const PORT = process.env.PORT || 55009;
server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
