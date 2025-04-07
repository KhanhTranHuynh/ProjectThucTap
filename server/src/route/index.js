const userRouter = require("./UserRouter");
const model3dRouter = require("./Model3dRouter");
const paymentRouter = require("./PaymentRouter");

const routes = (app) => {
  app.use("/api/userRouter", userRouter);
  app.use("/api/model3dRouter", model3dRouter);
  app.use("/api/payment", paymentRouter);
};

module.exports = routes;
