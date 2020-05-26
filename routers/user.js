const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require('../util/resHandle');
cosnt { md5pwd, getToken} = require('../util')
const verifyParmas = require("../middlewares/verify-params");
const {
  addUser,
  findUser,
  getUserInfo
} = require('../controllers/user');
// 注册
router.post("/reg",
  verifyParmas(['username', 'password']),
  async (ctx, next) => {
  try {
    let { username, password } = ctx.request.body;
    const user = await findUser(username)
    if (user) {
      return ctx.throw(500, '用户已存在')
    }
    password = md5pwd(password)
    let userInfo = {username, password}
    let user = await addUser(userInfo)
    userInfo.id = user.id;
    resSuccess({
      ctx, message: "用户注册成功", result: {
        userInfo,
        token: getToken(userInfo),  
    }});
  } catch (error) {
    error.message = '用户注册失败';
    throw error;
  }
  });

//登录
router.post('/login',  verifyParmas(['username', 'password']),
async (ctx, next) => {
try {
  let { username, password } = ctx.request.body;
  password = md5pwd(password)
  const user = await findUser(username)
  if (!user) {
    return ctx.throw(500, '该用户不存在')
  }
  password = md5pwd(password)
  if (password !== user.password) {
    return ctx.throw(500, '密码错误')
  }
  const userInfo = {username, password, id:user.id}
  resSuccess({
    ctx, message: "登录成功", result: {
      userInfo,
      token: getToken(userInfo)
  }});
} catch (error) {
  error.message = '用户注册失败';
  throw error;
}
});

router.get('/userInfo', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, "参数id缺失");
  }
  try {
    
  } catch (error) {

  }
})
module.exports = router;
