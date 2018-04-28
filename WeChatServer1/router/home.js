//路由层, 负责url处理
const Router = require("koa-router");

const user = new Router();
const homeController = require("../controllers/home");


user.get("/", homeController.getIndex);
user.post("/", homeController.checkXMLMiddleware);

module.exports = user;