const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const {
  md5Pwd,
  genToken,
  verifyRefreshToken,
  genRefreshToken,
} = require("../util/");
const verifyParmas = require("../middlewares/verify-params");
const { addUser, findUser, getUserInfo } = require("../controllers/user");
// 注册
router.post(
  "/reg",
  verifyParmas(["username", "password"]),
  async (ctx, next) => {
    try {
      let { username, password } = ctx.request.body;
      let user = await findUser(username);
      if (user) {
        return ctx.throw(400, "用户已存在");
      }
      password = md5Pwd(password);
      let userInfo = { username, password };
      user = await addUser(userInfo);
      resSuccess({
        ctx,
        message: "用户注册成功",
        result: {
          refreshtoken: genRefreshToken(user._id),
          token: genToken(user._id),
        },
      });
    } catch (error) {
      error.message = "用户注册失败";
      throw error;
    }
  }
);

//登录
router.post(
  "/login",
  verifyParmas(["username", "password"]),
  async (ctx, next) => {
    try {
      let { username, password } = ctx.request.body;
      const user = await findUser(username);
      if (!user) {
        return ctx.throw(400, "该用户不存在");
      }
      password = md5Pwd(password);
      if (password !== user.password) {
        return ctx.throw(400, "密码错误");
      }
      // const userInfo = { username, password, id: user.id };
      resSuccess({
        ctx,
        message: "登录成功",
        result: {
          refreshtoken: genRefreshToken(user._id),
          token: genToken(user._id),
        },
      });
    } catch (error) {
      error.message = "用户登录失败";
      throw error;
    }
  }
);

router.get("/info", async (ctx, next) => {
  const { id = ctx.userId } = ctx.request.query;
  if (!id) {
    return ctx.throw(400, "参数id缺失");
  }
  try {
    const userInfo = await getUserInfo(id);
    resSuccess({
      ctx,
      message: "获取用户信息成功",
      result: userInfo,
    });
  } catch (error) {
    error.message = "获取用户信息失败";
    throw error;
  }
});

// 刷新token
router.post("/refresh", async (ctx) => {
  try {
    let { refreshtoken } = ctx.request.body;
    const decoded = verifyRefreshToken(refreshtoken);
    refreshtoken = genRefreshToken(decoded.data);
    let token = genToken(decoded.data);
    resSuccess({
      ctx,
      message: "刷新token成功",
      result: {
        token,
        refreshtoken: refreshtoken
      },
    });
  } catch (err) {
    ctx.throw(401, "请重新登录");
  }
});

module.exports = router;
