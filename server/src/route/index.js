const userRouter = require("./UserRouter");
const model3dRouter = require("./Model3dRouter");
const PaymentRouter = require("./PaymentRouter");
const sendEmail = require("./SendEmail");
const settingsRouter = require("./settingsRouter");

const routes = (app) => {
  app.use("/api/userRouter", userRouter);
  app.use("/api/model3dRouter", model3dRouter);
  app.use("/api/PaymentRouter", PaymentRouter);
  app.use("/api/sendEmail", sendEmail);
  app.use("/api/settings", settingsRouter);
};

module.exports = routes;
