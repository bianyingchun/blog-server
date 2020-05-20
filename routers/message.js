const xss = require("xss");
const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const verifyParmas = require("../middlewares/verify-params");
const {
    addMessage,
    deleteMessage,
    getMessage,
    editMessage,
} = require("../controllers/message");

const { sendMail } = require("../util/email");
const sendMailToAdminAndTargetUser = (message) => {
    sendMail({
        to: `2093213209@qq.com`,
        subject: "博客有新的留言",
        text: `来自 ${message.author.name} 的留言：${message.content}`,
        html: `<p> 来自 ${message.author.name} 的留言：${
            message.content
            }</p><br><a href="${
            message.permalink || "javascript:;"
            }" target="_blank">[ 点击查看 ]</a>`,
    });
};

router.post(
    "/add",
    verifyParmas(["content", "author"]),
    async (ctx, next) => {
        let { content, author } = ctx.request.body;
        content = xss(content);
        try {
            let message = await addMessage(ctx, { content, author });
            // 测试发送可行，暂时关闭
            // sendMailToAdminAndTargetUser(message);
            resSuccess({ ctx, message: "添加留言成功" });
        } catch (error) {
            error.message = "添加留言失败";
            throw error;
        }
    }
);

router.post("/delete", async (ctx, next) => {
    const { id } = ctx.request.body;
    if (!id) {
        return ctx.throw(500, "参数id缺失");
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
        return ctx.throw(500, "参数id 缺失");
    }
    try {
        await editMessage(id, info);
        resSuccess({ ctx, message: "修改留言成功" });
    } catch (error) {
        error.message = "修改留言失败";
        throw error;
    }
});

router.get("/get", async (ctx, next) => {
    try {
        const res = await getMessage(ctx.query);
        resSuccess({ ctx, message: "获取留言成功", result: res });
    } catch (err) {
        err.message = "获取留言失败";
        throw err;
    }
});

module.exports = router;
