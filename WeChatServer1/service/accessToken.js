const request = require('async-request');

//获取access_token并检测是否token失效
const getAccessToken = async () => {
    //判断是否是过时,过时则获取新的token
    const token = await toWechatAccessToken();
    return Promise.resolve(token);
}

//去微信服务端获取access_token
toWechatAccessToken = async () => {
    var res = await request(`http://127.0.0.1:6300/getAccessToken`)
    let { access_token } = JSON.parse(res.body);
    return Promise.resolve(access_token);
}

module.exports = {
    getAccessToken
}
