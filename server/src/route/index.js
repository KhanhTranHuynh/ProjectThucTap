const userRouter = require("./UserRouter");
const model3dRouter = require("./Model3dRouter");
const PaymentRouter = require("./PaymentRouter");
const sendEmail = require("./SendEmail");

const routes = (app) => {
  app.use("/api/userRouter", userRouter);
  app.use("/api/model3dRouter", model3dRouter);
  app.use("/api/PaymentRouter", PaymentRouter);
  app.use("/api/sendEmail", sendEmail);
};

module.exports = routes;
