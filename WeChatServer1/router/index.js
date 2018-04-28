//所有路由汇总index.js
const router = require("koa-router")();
const home = require("./home");
const identity = require("./identity");


router.use('/', home.routes(), home.allowedMethods())
router.use('/identity', identity.routes(), identity.allowedMethods())
module.exports = router;