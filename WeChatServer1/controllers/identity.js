const { uploadIdentity } = require("../service/identity");

exports.authentication = async (ctx) => {
    await ctx.render("index");
}

exports.upload = async (ctx) => {
    let result = await uploadIdentity(ctx);
    ctx.body = result
}