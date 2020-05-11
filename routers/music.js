const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const verifyParmas = require("../middlewares/verify-params");
const { upload } = require("../util/upload");
const {
    addMusic,
    delectMusic,
    editeMusic,
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
        err.message = '歌曲海报上传失败';
        throw err;
    }
});
module.exports = router;
