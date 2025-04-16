"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Nếu có liên kết với User, có thể thêm ở đây:
      // Message.belongsTo(models.User, { foreignKey: "senderID", targetKey: "email" });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.STRING,
      },
      senderID: {
        type: DataTypes.STRING,
      },
      text: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: false,
    }
  );

  return Message;
};
