const bodyParser = require("koa-bodyparser");
const helmet = require("koa-helmet");
const cors = require("koa2-cors");
const routers = require("../routers");
const auth = require('./auth');
const { resError, resSuccess } = require('../util/resHandle');
const middlewares = (app) => {

  // 错误处理中间件
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // 响应用户

      const code = err.statusCode || err.status || 500;
      if (code === 402) {
        resSuccess({ ctx, message: 'token 已过期', code });
      } else {
        ctx.status = code;
        resError({ ctx, message: err.message, err, code });
        ctx.app.emit("error", err); // 触发应用层级错误事件
      }
    }
  });
  // 跨域
  app.use(
    cors({
      origin: function (ctx) {
        //设置允许来自指定域名请求
        return "*";
        // if (ctx.url === '/test') {
        //     return '*'; // 允许来自所有域名请求
        // }
        // return 'http://localhost:8080'; //只允许http://localhost:8080这个域名的请求
      },
      maxAge: 5, //指定本次预检请求的有效期，单位为秒。
      credentials: true, //是否允许发送Cookie
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
      allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
      exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
    })
  );
  app.use(helmet());

  app.use(bodyParser());
  app.use(auth());
  app.use(routers.routes(), routers.allowedMethods());
  // 全局错误事件监听
  app.on("error", (error) => {
    console.error(error);
  });
};

module.exports = middlewares;
