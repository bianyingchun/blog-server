const { verifyToken } = require("../util");
const auth = () => async (ctx, next) => {
  const req = ctx.request;
  let access = false;
  if (!_jumpAuth(req.url)) {
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.trim().split(" ");
      if (parts.length === 2) {
        const schema = parts[0];
        const token = parts[1];
        if (schema === "Bearer") {
          try {
            const decode = await verifyToken(token);
            ctx.userId = decode.data;
            access = true;
          } catch (err) {
            return ctx.throw(402, "token 已过期");
          }
        }
      }
    }
  } else {
    access = true;
  }
  if (access) {
    await next();
  } else {
    ctx.throw(403, "拒绝访问");
  }
};

const _jumpAuth = (path) => {
  const JUMP_ROUTER = [
    '/search/hot',
    '/message/add',
    '/message/all',
    "/project/list",
    '/user/login', '/user/reg', '/user/refresh',
    "/article/like", '/article/detail', '/article/list', '/article/group',
    "/tag/list", '/wallpaper/list',
    '/comment/list/withreply', '/comment/add', '/comment/like', '/reply/add', '/reply/list', '/reply/like', '/music/playlist', '/music/lyric', '/music/login'];
  return JUMP_ROUTER.some(item => path.indexOf(item) !== -1);
};
module.exports = auth;
