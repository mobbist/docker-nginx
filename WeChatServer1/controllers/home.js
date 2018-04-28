//控制器, 负责业务调度
const { checkSignature } = require("../service/homeService");
const { getAccessToken } = require("../service/accessToken");
const { getMessage } = require("../service/message");
exports.getIndex = async (ctx) => {
    // let accessToken = await getAccessToken();
    ctx.body = "123"
    // ctx.res.setHeader('Content-Type', 'application/xml')
    // ctx.res.end("<abc>123</abc>")
}

//检测是否是XML中间件的请求
exports.checkXMLMiddleware = async (ctx) => {



    if (ctx.method == 'POST' && ctx.is('text/xml')) {
        let message = await getMessage(ctx);
        //console.log(123, message);
    }
}
// xmlTool.js

// const jsonToXml = (obj) => {
//     const builder = new xml2js.Builder()
//     return builder.buildObject(obj)
// }
// message = {
//     text(msg, content) {
//         return jsonToXml({
//             xml: {
//                 ToUserName: msg.FromUserName,
//                 FromUserName: msg.ToUserName,
//                 CreateTime: Date.now(),
//                 MsgType: msg.MsgType,
//                 Content: content
//             }
//         })
//     }
// }

// app.use(async (ctx, next) => {
//     //这里监听微信消息



//             
//                 // if (err) {
//                 //     Promise.reject(err)
//                 // } else {
//                 //     Promise.resolve(result)
//                 // }
//             })
//             //console.log(json);
//         })



//         await next()
//     } else {
//         ctx.body = "body";
//     }
// })


