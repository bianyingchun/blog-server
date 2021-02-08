const xss = require("xss");
const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const verifyParmas = require("../middlewares/verify-params");
const {
    addMessage,
    deleteMessage,
    getAllMessage,
    getMessageByPage,
    editMessage,
} = require("../controllers/message");


router.post(
    "/add",
    verifyParmas(["content"]),
    async (ctx, next) => {
        let { content, style = {} } = ctx.request.body;
        content = xss(content);
        try {
            const message = await addMessage({ content, style });
            resSuccess({ ctx, message: "添加留言成功", result: message });
        } catch (error) {
            error.message = "添加留言失败";
            throw error;
        }
    }
);

router.post("/delete", async (ctx, next) => {
    const { id } = ctx.request.body;
    if (!id) {
        return ctx.throw(400, "参数id缺失");
    }
    try {
        await deleteMessage(id);
        resSuccess({ ctx, message: "删除留言成功" });
    } catch (error) {
        error.message = "留言删除失败";
        throw error;
    }
});


router.post("/edit", async (ctx, next) => {
    const { id, info } = ctx.request.body;
    if (!id) {
        return ctx.throw(400, "参数id 缺失");
    }
    try {
        await editMessage(id, info);
        resSuccess({ ctx, message: "修改留言成功" });
    } catch (error) {
        error.message = "修改留言失败";
        throw error;
    }
});

router.get("/all", async (ctx, next) => {
    try {
        const res = await getAllMessage();
        resSuccess({ ctx, message: "获取全部留言成功", result: res });
    } catch (err) {
        err.message = "获取全部留言失败";
        throw err;
    }
});

router.get('/list', async (ctx, next) => {
    try {
        const res = await getMessageByPage(ctx.query);
        resSuccess({ ctx, message: "分页获取留言成功", result: res });
    } catch (err) {
        err.message = "分页获取留言失败";
        throw err;
    }
});
module.exports = router;
