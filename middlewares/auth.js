const { verifyToken } = require("../util");
const auth = () => async (ctx, next) => {
  const req = ctx.request;
  if (!_jumpAuth(req.url)) {
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.trim().split(" ");
      if (parts.length === 2) {
        const schema = parts[0];
        const token = parts[1];
        if (schema === "Bearer") {
          try {
            ctx.userId = await verifyToken(token);
            return await next();
          } catch (err) {
            ctx.throw(402, "token 已过期");
          }
        }
      }
    }
    ctx.throw(403, "拒绝访问");
  } else {
    await next();
  }
};

const _jumpAuth = (path) => {
  const JUMP_ROUTER = [
    "/user/login",
    "/user/reg",
    "/user/refresh",
    "/article/like",
    "/article/get",
    "/article/getAll",
    "/article/group",
    "/tag/list",
  ];
  return JUMP_ROUTER.some((item) => item.indexOf(path) !== -1);
};
module.exports = auth;
