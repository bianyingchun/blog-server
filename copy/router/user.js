const express = require("express");
// const xss = require('xss')
const router = express.Router();
const { radomStr } = require("../util");
const { resError, resSuccess } = require("../util/resHandler");
const {
  md5Pwd,
  genToken,
  verifyRefreshToken,
  genRefreshToken,
} = require("../util/jwt");
const { sendCodeMsg, verifyCode } = require("../util/message");
const {
  addUser,
  findUser,
  findUserById,
  updateUser,
  getLikedGraphs,
  getUserGraphs,
  editUser,
} = require("../controller/user");

router.post("/add", async (req, res) => {
  const { username, password } = req.body;
  const user = await addUser({ username, password: md5Pwd(password) });
  res.json({ result: user });
});

// 验证码登录注册
router.post("/login/nopwd", async (req, res) => {
  let { codekey, code, tel, username } = req.body;
  try {
    let result = verifyCode(code, tel, codekey);
    if (!result) {
      return resError(res, { msg: "验证码错误" });
    }
    let user = await findUser({ tel: tel });
    if (!user) {
      username = username ? username : radomStr(12, { number: true });
      user = await addUser({ username, tel });
    }
    resSuccess(res, {
      refreshtoken: genRefreshToken(user._id),
      token: genToken(user._id),
    });
  } catch (err) {
    resError(res, err);
  }
});

// 手机号密码登录
router.post("/login/pwd", async (req, res) => {
  const { tel, password } = req.body;
  try {
    let user = await findUser({ tel, password: md5Pwd(password) });
    if (!user) {
      return resError(res, { msg: "手机号或密码错误" });
    }
    resSuccess(res, {
      refreshtoken: genRefreshToken(user._id),
      token: genToken(user._id),
    });
  } catch (err) {
    resError(res, err);
  }
});

router.get("/info", async (req, res) => {
  let { id } = req.query;
  id = id || req.uid;
  try {
    const user = await findUserById(id);
    resSuccess(res, user);
  } catch (err) {
    resError(res, err);
  }
});

//发送验证码
router.post("/sendcode", async (req, res) => {
  let tel = req.body.tel;
  try {
    let code = await sendCodeMsg(tel);
    resSuccess(res, code);
  } catch (err) {
    resError(res, err);
  }
});
// 校验验证码
router.post("/verify", async (req, res) => {
  let { codekey, code, tel } = req.body;
  let result = verifyCode(code, tel, codekey);
  if (!result) {
    resError(res, { msg: "验证码错误" });
  } else {
    resSuccess(res, { verified: true });
  }
});

// 刷新token
router.post("/refresh", async (req, res) => {
  try {
    let { refreshtoken } = req.body;
    const decoded = verifyRefreshToken(refreshtoken);
    let token = genToken(decoded.data);
    refreshtoken = genRefreshToken(decoded.data);
    resSuccess(res, {
      token: token,
      refreshtoken: refreshtoken,
      msg: "刷新token成功",
    });
  } catch (err) {
    resError(res, {
      code: 401,
      msg: "请重新登录",
    });
  }
});

router.post("/resetpwd", async (req, res) => {
  try {
    const { tel, password } = req.body;
    let user = await updateUser({ tel }, { password: md5Pwd(password) });
    resSuccess(res, {
      refreshtoken: genRefreshToken(user._id),
      token: genToken(user._id),
    });
  } catch (err) {
    resError(res, err);
  }
});

router.get("/likes", async (req, res) => {
  const { id = req.uid } = req.query;
  const opts = req.query;
  if (!id) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    const result = await getLikedGraphs(id, opts);
    resSuccess(res, result);
  } catch (err) {
    resError(err);
  }
});

router.get("/graphs", async (req, res) => {
  const { id = req.uid } = req.query;
  const opts = req.query;
  if (!id) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    const result = await getUserGraphs(id, opts);
    resSuccess(res, result);
  } catch (err) {
    resError(err);
  }
});

router.post("/edit", async (req, res) => {
  const { id = req.uid, info } = req.body;
  if (!id) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    const result = await editUser(id, info);
    resSuccess(res, result);
  } catch (err) {
    resError(err);
  }
});

module.exports = router;
