const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const verifyParmas = require("../middlewares/verify-params");
const upload = require("../util/upload");
// const {
//   addMusic,
//   delectMusic,
//   editeMusic,
//   getMusic,
//   uploadPoster,
// } = require("../controllers/music");

router.post("/upload", upload.single("file"), async (ctx, next) => {
  resSuccess({
    ctx,
    message: "上传成功",
    result: { filename: ctx.req.file.filename },
  });
});

module.exports = router;
