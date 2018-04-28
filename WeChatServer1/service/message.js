
const xml2js = require('xml2js')


exports.getMessage = async (ctx) => {
    let msg = await getData(ctx);
    msg = jsonToXml({
        xml: {
            ToUserName: msg.xml.FromUserName,
            FromUserName: msg.xml.ToUserName,
            CreateTime: Date.now(),
            MsgType: msg.xml.MsgType,
            Content: returnMessage(msg.xml.Content[0])
        }
    });

    ctx.res.setHeader('Content-Type', 'application/xml')
    ctx.res.end(msg);
}

//返回获得的xml数据,并转为json格式 (promise)
const getData = async (ctx) => {
    return new Promise(function (resolve, reject) {
        let xml = ''
        ctx.req.setEncoding('utf8')
        //监听接受xml数据
        ctx.req.on('data', (chunk) => {
            xml += chunk
        })
        //接受完成转为JSON
        ctx.req.on('end', () => {
            xml2js.parseString(xml, (err, result) => {
                if (err) {
                    reject("err");
                } else {
                    resolve(result);
                }
            })
        })
    })
}

//将要发送的数据, 转为xml格式 (promise)
const jsonToXml = (obj) => {
    const builder = new xml2js.Builder()
    return builder.buildObject(obj)
}

//传入内容, 返回响应的内容
const returnMessage = (message) => {

    switch (message) {
        case "1":
            return "<a href='http://47.91.245.123/identity/authentication'>点击上传身份认证</a>"

        default:
            return "请输入1,进行上传身份认证"
    }
}