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
<<<<<<< HEAD
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
=======
    console.log(path);
    const JUMP_ROUTER = ['/user/login', '/user/reg', '/user/refresh',
        "/article/like", '/article/detail', '/article/list', '/article/group',
        "/tag/list", '/wallpaper/list'];
    return JUMP_ROUTER.some(item => path.indexOf(item) !== -1);
>>>>>>> 931e3ceeb0ef319d5b16bdfbd9b0671cba1d3112
};
module.exports = auth;
