const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const verifyParmas = require("../middlewares/verify-params");
const { upload } = require("../util/upload");
const {
  addMusic,
  deleteMusic,
  editMusic,
  getMusic,
  uploadPosterCDN,
} = require("../controllers/music");
// 测试文件上传
// router.post("/upload", upload.single("file"), async (ctx, next) => {
//     resSuccess({
//         ctx,
//         message: "上传成功",
//         result: { file: ctx.req.file },
//     });
// });
router.post("/upload", upload.single("file"), async (ctx, next) => {
  const file = ctx.req.file;
  try {
    const res = await uploadPosterCDN(file);
    resSuccess({ ctx, message: "歌曲海报上传成功", result: res.key });
  } catch (err) {
    err.message = "歌曲海报上传失败";
    throw err;
  }
});

router.post(
  "/add",
  verifyParmas(["title", "name", "url", "lyrics"]),
  async (ctx, next) => {
    try {
      await addMusic(ctx, ctx.request.body);
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
    return ctx.throw(500, "参数id 缺失");
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
    return ctx.throw(500, "参数id缺失");
  }
  try {
    await deleteMusic(id);
    resSuccess({ ctx, message: "删除音乐成功" });
  } catch (error) {
    error.message = "音乐删除失败";
    throw error;
  }
});

router.get("/get", async (ctx, next) => {
  try {
    const res = await getMusic(ctx.query);
    resSuccess({ ctx, message: "获取音乐成功", result: res });
  } catch (err) {
    err.message = "获取音乐失败";
    throw err;
  }
});

module.exports = router;
