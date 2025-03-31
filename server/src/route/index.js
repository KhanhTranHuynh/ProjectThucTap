const userRouter = require("./UserRouter");
const model3dRouter = require("./Model3dRouter");

const routes = (app) => {
  app.use("/api/userRouter", userRouter);
  app.use("/api/model3dRouter", model3dRouter);
};

module.exports = routes;
