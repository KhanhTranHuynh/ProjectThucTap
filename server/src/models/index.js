const User = require("./User");
const Models3d = require("./Models3d");

// Thiết lập quan hệ 1-n: Một User có nhiều Models3d
User.hasMany(Models3d, {
  foreignKey: "users_email",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Models3d.belongsTo(User, {
  foreignKey: "users_email",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = { User, Models3d };
