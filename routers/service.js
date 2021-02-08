const Router = require("koa-router");
const router = new Router();
const { APP, QINIU } = require('../config');
const { resSuccess } = require("../util/resHandle");
const { upToQiniu, removeTemFile } = require("../util/upload");
const { upload } = require("../util/upload");
// 测试文件上传

router.post("/upload", upload.single("file"), async (ctx, next) => {
    const file = ctx.req.file;
    let { path, filename } = file;
    try {
        const qiniu = await upToQiniu(path, filename);
        removeTemFile(path);
        path = `http://${QINIU.uploadURL}/${qiniu.key}`;
        resSuccess({ ctx, message: "上传到cdn成功", result: path });
    } catch (err) {
        path = `${APP.URL}${APP.STATIC_PATH}/${filename}`;
        resSuccess({ ctx, message: "上传到本地成功", result: path });
    }
});


module.exports = router;
