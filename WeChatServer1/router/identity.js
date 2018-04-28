//路由层, 负责url处理
const Router = require("koa-router");

const user = new Router();
const { authentication, upload } = require("../controllers/identity");


user.get("/authentication", authentication);

user.post("/upload", upload);
module.exports = user;