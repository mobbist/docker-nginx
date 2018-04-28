//const {query} = require("../utils/pool");
//具体干实事的模块
const sha1 = require("sha1");


//验证微信转发服务器(安全模式)
async function checkSignature(ctx) {
    let token = "airwallexBillZhu";
    let { signature, timestamp, nonce, echostr } = ctx.request.query
    /* 
        1）将token、timestamp、nonce三个参数进行字典序排序 
        2）将三个参数字符串拼接成一个字符串进行sha1加密 
        3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信 
    */
    var str = [token, timestamp, nonce].sort().join('');
    var sha = sha1(str);
    console.log("token:" + token);
    console.log("timestamp:" + timestamp);
    console.log("nonce:" + nonce);
    console.log("signature:" + signature);
    console.log("最终编译是否和signature一样:" + sha);
    console.log("请求方式:" + ctx.request.method);
    console.log("最终是否一样: " + (sha == signature));
    if (ctx.request.method == 'GET') {
        if (sha == signature) {
            return Promise.resolve(echostr);
        } else {
            return Promise.resolve(false);
        }
    } else {
        return Promise.resolve(false);
    }


}
//验证微信转发服务器(明文模式)
async function easyCheck(ctx) {
    console.log(ctx.request.query);
}
module.exports = {
    checkSignature,
    easyCheck
}