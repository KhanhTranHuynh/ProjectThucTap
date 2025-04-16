"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Định nghĩa các mối quan hệ nếu có
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      money: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW"),
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users", // Chỉ định tên bảng
      timestamps: false, // Bảng đã có trường created_at và updated_at, nên không cần tự động thêm timestamps
    }
  );

  return User;
};
