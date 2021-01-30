const xss = require("xss");
const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const verifyParmas = require("../middlewares/verify-params");
const {
  addComment,
  deleteComment,
  getComment,
  editComment,
  likeComment,
} = require("../controllers/comment");
const { getReply } = require('../controllers/reply');
const { sendMail } = require("../util/email");
const sendMailToAdminAndTargetUser = (comment) => {
  sendMail({
    to: `2093213209@qq.com`,
    subject: "博客有新的留言",
    text: `来自 ${comment.author.name} 的留言：${comment.content}`,
    html: `<p> 来自 ${comment.author.name} 的留言：${
      comment.content
      }</p><br><a href="${
      comment.permalink || "javascript:;"
      }" target="_blank">[ 点击查看 ]</a>`,
  });
};

router.post(
  "/add",
  verifyParmas(["post_id", "content", "author"]),
  async (ctx, next) => {
    let { post_id, content, author } = ctx.request.body;
    content = xss(content);
    try {
      let comment = await addComment(ctx, { post_id, content, author });
      // 测试发送可行，暂时关闭
      // sendMailToAdminAndTargetUser(comment);
      resSuccess({ ctx, message: "添加评论成功", result: comment });
    } catch (error) {
      error.message = "添加评论失败";
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
    await deleteComment(id);
    resSuccess({ ctx, message: "删除评论成功" });
  } catch (error) {
    error.message = "评论删除失败";
    throw error;
  }
});

router.post("/like", async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, "参数id缺失");
  }
  try {
    const newItem = await likeComment(id);
    resSuccess({ ctx, message: "喜欢评论成功", result: newItem });
  } catch (error) {
    error.message = "喜欢评论失败";
    throw error;
  }
});

router.post("/edit", async (ctx, next) => {
  const { id, info } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, "参数id 缺失");
  }
  try {
    await editComment(id, info);
    resSuccess({ ctx, message: "修改评论成功" });
  } catch (error) {
    error.message = "修改评论失败";
    throw error;
  }
});

router.get("/list", async (ctx, next) => {
  try {
    const res = await getComment(ctx.query);
    resSuccess({ ctx, message: "获取评论成功", result: res });
  } catch (err) {
    err.message = "获取评论失败";
    throw err;
  }
});

router.get('/list/withreply', async (ctx, next) => {
  try {
    const { post_id } = ctx.query;
    if (!post_id) {
      return ctx.throw(500, "参数 post_id 缺失");
    }
    const commentResult = await getComment(ctx.request.query);
    const { pagination, list } = commentResult;
    const getReplyTasks = list.map(item => getReply({ cid: item._id }));
    const replyResult = await Promise.all(getReplyTasks);
    const result = {
      list: [],
      pagination
    };
    result.list = list.map((item, index) => {
      item = item.toObject();
      item.replies = replyResult[index];
      return item;
    });
    resSuccess({ ctx, message: "获取评论成功", result: result });
  } catch (err) {
    err.message = "获取评论列表失败";
    throw err;
  }
});
module.exports = router;
