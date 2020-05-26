const bodyParser = require("koa-bodyparser");
const helmet = require("koa-helmet");
const cors = require("koa2-cors");
const routers = require("../routers");
const koaJwt = require('koa-jwt');
const { TOKEN } = require('../config');
const { resError } = require('../util/resHandle');
const { verifyToken, getToken } = require('../util');
const middlewares = (app) => {

  // 错误处理中间件
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // 响应用户
      ctx.status = err.statusCode || err.status || 500;
      resError({ ctx, message: err.message, err });
      ctx.app.emit("error", err); // 触发应用层级错误事件
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
  app.use(async (ctx, next) => {
    if (ctx.header && ctx.header.authorization) {
      const parts = ctx.header.authorization.split(' ');
      if (parts.length === 2) {
        const schema = parts[0];
        const token = parts[1];
        // if (schema === 'Bearer') {
        //   try {
        //     ctx.userInfo = await verifyToken(token);
        //   } catch (err) {
        //     const newToken = getToken();
        //   }
        // } else {

        // }
      }
    }
  });
  app.use(
    koaJwt({
      secret: TOKEN.screct
    }).unless({
      path: [/^\user\/login /, /^\user\/reg /]
    })
  );
  app.use(routers.routes(), routers.allowedMethods());
  // 全局错误事件监听
  app.on("error", (error) => {
    console.error(error);
  });
};

module.exports = middlewares;
