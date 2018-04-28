const fs = require('fs');
const path = require('path');

//文件上传模块
exports.uploadIdentity = async (ctx) => {
    return new Promise((resolve, reject) => {

        const files = ctx.request.body.files || {};
        for (let key in files) {
            //获得每一项的file的key值
            const file = files[key];
            //然后生成最终目标的地址+文件名
            const filePath = path.join("./uploads/images/", file.name);
            //设置读取临时文件路径(此时已经上传到服务器的一个临时目录)
            const reader = fs.createReadStream(file.path);
            //设置写入到目标地址
            const writer = fs.createWriteStream(filePath);
            //写入 
            reader.pipe(writer);
            //删除临时文件路径
            fs.unlink(file.path, (err) => {
                if (err) {
                    throw new Error("删除文件出错");
                };
            });
        }
        resolve({ status: 200, message: '上传成功' });
    })
}