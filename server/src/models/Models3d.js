const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectDB")();

const Models3d = sequelize.define(
  "Models3d",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    users_email: {
      type: DataTypes.STRING(255),
      allowNull: true, // Sẽ cập nhật thành false khi thiết lập quan hệ
    },
    link_video: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    link_3d: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW"),
    },
  },
  {
    tableName: "models3d",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Models3d;
