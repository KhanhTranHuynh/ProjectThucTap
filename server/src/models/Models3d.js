"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Models3d extends Model {
    static associate(models) {
      // Bạn có thể liên kết với bảng Users ở đây nếu muốn:
      // Models3d.belongsTo(models.User, { foreignKey: "users_email", targetKey: "email" });
    }
  }

  Models3d.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      users_email: {
        type: DataTypes.STRING,
      },
      link_video: {
        type: DataTypes.STRING,
      },
      link_3d: {
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
      modelName: "Models3d",
      tableName: "models3d", // tên bảng đúng như MySQL
      timestamps: false, // đã có created_at và updated_at trong CSDL
    }
  );

  return Models3d;
};
