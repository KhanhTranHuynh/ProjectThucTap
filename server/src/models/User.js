"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      money: {
        type: DataTypes.FLOAT,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "client",
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
      modelName: "User",
      tableName: "users", // Rất quan trọng nếu tên table là `users` thay vì `Users`
      timestamps: false, // Vì bạn đang dùng thủ công created_at / updated_at
    }
  );

  return User;
};
