const xss = require("xss");
const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const verifyParmas = require("../middlewares/verify-params");
const {
  addReply,
  deleteReply,
  editReply,
  likeReply,
  getReplyByCid,
  changeReplyStatus,
} = require("../controllers/reply");
const { sendMail } = require("../util/email");

const sendMailToAdminAndTargetUser = (reply) => {
  let str = `2093213209@qq.com, ${reply.comment.author.email}`;
  if (reply.to && reply.to.email) {
    str += `, ${reply.to.email}`;
  }
  sendMail({
    to: str,
    subject: "你在blog.bianyc.me有新的评论回复",
    text: `来自 ${reply.from.name} 的评论回复：${reply.content}`,
    html: `<p> 来自${reply.from.name} 的评论回复：${reply.content}</p><br><a href="${reply.permalink}" target="_blank">[ 点击查看 ]</a>`,
  });
};

router.post(
  "/add",
  verifyParmas(["post_id", "cid", "content", "from"]),
  async (ctx, next) => {
    let { info } = ctx.request.body;
    info.content = xss(info.content);
    try {
      let reply = await addReply(ctx, info);
      sendMailToAdminAndTargetUser(reply);
      delete reply.comment;
      resSuccess({ ctx, message: "回复成功", result: reply });
    } catch (error) {
      error.message = "回复失败";
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
    await deleteReply(id);
    resSuccess({ ctx, message: "删除回复成功" });
  } catch (error) {
    error.message = "回复删除失败";
    throw error;
  }
});

router.post("/like", async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, "参数id缺失");
  }
  try {
    await likeReply(id);
    resSuccess({ ctx, message: "喜欢回复成功" });
  } catch (error) {
    error.message = "喜欢回复失败";
    throw error;
  }
});

router.post("/edit", async (ctx, next) => {
  const { id, info } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, "参数id缺失");
  }
  try {
    await editReply(id, info);
    resSuccess({ ctx, message: "修改评论回复成功" });
  } catch (error) {
    error.message = "修改评论回复失败";
    throw error;
  }
});

// 根据评论id获取回复
router.get("/get", async (ctx, next) => {
  if (!ctx.query.cid) {
    return ctx.throw(500, "参数cid缺失");
  }
  try {
    const res = await getReplyByCid(ctx.query);
    resSuccess({ ctx, message: "获取回复成功", result: res });
  } catch (err) {
    err.message = "获取回复失败";
    throw err;
  }
});

router.post("/status", async (ctx, next) => {
  const { id, state } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, "参数id 缺失");
  }
  try {
    await changeReplyStatus(id, state);
    resSuccess({ ctx, message: "修改回复状态成功" });
  } catch (error) {
    error.message = "修改回复状态失败";
    throw error;
  }
});
module.exports = router;
