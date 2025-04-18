"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {}
  }
  Payment.init(
    {
      Payment_Method: DataTypes.STRING,
      Oder_TotalPrice: DataTypes.FLOAT,
      UserID: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
