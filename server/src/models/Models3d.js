"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Models3D extends Model {
    static associate(models) {
      // Định nghĩa mối quan hệ với bảng User, nếu cần thiết
      // Ví dụ: Models3D.belongsTo(models.User, { foreignKey: 'users_email', targetKey: 'email' });
    }
  }

  Models3D.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // AI (Auto Increment)
        allowNull: false,
      },
      users_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
      modelName: "Models3D",
      tableName: "models3d", // Chỉ định tên bảng
      timestamps: false, // Bảng đã có trường created_at và updated_at, nên không cần tự động thêm timestamps
    }
  );

  return Models3D;
};
