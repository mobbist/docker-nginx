const Koa = require('koa')
const app = new Koa()
const request = require('async-request');

const toWeChatGetAccessToken = async () => {
    let appid = "wxe2688e3d857ef00f"
    let secret = "740fa80d6ee2d8b4702eb0545a2eb82c"
    let res = await request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
    res = JSON.parse(res.body);
    console.log("newToken");
    if (res.access_token) {
        return Promise.resolve(res);
    } else {
        return Promise.resolve(res.errcode);
    }
}

let accessToken;
let expiresIn = 0;

app.use(async (ctx) => {
    if (ctx.url == "/getAccessToken") {
        if (accessToken) {
            ctx.body = accessToken
        } else {
            accessToken = await toWeChatGetAccessToken();
        }
        ctx.body = accessToken
    } else {

        ctx.body = 'error'
    }
})





app.listen(8000, "127.0.0.1")
console.log('[demo] start-quick is starting at port 8000')