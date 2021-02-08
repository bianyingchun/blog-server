const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const verifyParmas = require("../middlewares/verify-params");
const {
  addMusic,
  deleteMusic,
  editMusic,
  getMusic,
  getMusicList,
  getLikeList,
  getLyric,
  loginByPhone,
  getPlayList
} = require("../controllers/music");

router.post(
  "/add",
  verifyParmas(["title", "singer", "lyrics"]),
  async (ctx, next) => {
    try {
      await addMusic(ctx.request.body);
      resSuccess({ ctx, message: "添加音乐成功" });
    } catch (error) {
      error.message = "添加音乐失败";
      throw error;
    }
  }
);

router.post("/edit", async (ctx, next) => {
  const { id, info } = ctx.request.body;
  if (!id) {
    return ctx.throw(400, "参数id 缺失");
  }
  try {
    await editMusic(id, info);
    resSuccess({ ctx, message: "修改评论成功" });
  } catch (error) {
    error.message = "修改评论失败";
    throw error;
  }
});

router.post("/delete", async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    return ctx.throw(400, "参数id缺失");
  }
  try {
    await deleteMusic(id);
    resSuccess({ ctx, message: "删除音乐成功" });
  } catch (error) {
    error.message = "音乐删除失败";
    throw error;
  }
});

router.get("/list", async (ctx, next) => {
  try {
    const res = await getMusicList(ctx.query);
    resSuccess({ ctx, message: "获取音乐列表成功", result: res });
  } catch (err) {
    err.message = "获取音乐列表失败";
    throw err;
  }
});

router.get('/detail', async (ctx) => {
  const { id } = ctx.query;
  if (!id) {
    return ctx.throw(400, "参数id 缺失");
  }
  try {
    const result = await getMusic(id);
    resSuccess({ ctx, message: '查询音乐成功', result });
  } catch (error) {
    error.message = '查询音乐失败';
    throw error;
  }
});

router.get('/likelist', async (ctx) => {
  try {
    const result = await getLikeList();
    resSuccess({ ctx, message: '获取歌单成功', result });
  } catch (error) {
    error.message = '获取歌单失败';
    throw error;
  }
});
router.get('/playlist', async (ctx) => {
  const { id } = ctx.query;
  if (!id) {
    return ctx.throw(400, "参数id 缺失");
  }
  try {
    const result = await getPlayList(id);
    resSuccess({ ctx, message: '获取歌单成功', result });
  } catch (error) {
    error.message = '获取歌单失败';
    throw error;
  }
});
router.get('/lyric', async (ctx) => {
  const { id } = ctx.query;
  if (!id) {
    return ctx.throw(400, "参数id 缺失");
  }
  try {
    const result = await getLyric(id);
    resSuccess({ ctx, message: '获取歌词成功', result });
  } catch (error) {
    error.message = '获取歌词失败';
    throw error;
  }
});

router.get('/login', async (ctx) => {
  const { phone, password } = ctx.query;
  if (!phone || !password) {
    return ctx.throw(400, "参数缺失");
  }
  try {
    const result = await loginByPhone(phone, password);
    resSuccess({ ctx, message: '登录成功', result });
  } catch (error) {
    error.message = '登录失败';
    throw error;
  }
});

module.exports = router;
