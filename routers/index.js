const Router = require("koa-router");
const router = new Router();
const fs = require("fs");
const path = require("path");

// 模块化拆分
const files = fs.readdirSync(__dirname);
files
  .filter((file) => {
    return file.endsWith(".js") && file !== "index.js";
  })
  .forEach((file) => {
    let fileName = file.slice(0, -3);
    let fileEntry = require(path.join(__dirname, file));
    router.use(`/${fileName}`, fileEntry.routes(), fileEntry.allowedMethods());
  });

module.exports = router;
// https://www.jianshu.com/p/4a8654b69576
// http://www.mamicode.com/info-detail-2522077.html
