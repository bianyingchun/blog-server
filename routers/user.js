const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require('../util/resHandle');
const {
  addArticle,
  deleteArticle,
  getArtilesByPage,
  getArticlesByGroup,
  getArticleById,
  likeArticle,
  changeArticleStatus,
  editArticle
} = require('../controllers/article');
// 增
router.post("/add", async (ctx, next) => {
  try {
    let article = await addArticle(ctx.request.body);
    resSuccess({ ctx, message: '添加文章成功', result: article });
  } catch (error) {
    error.message = '文章添加失败';
    throw error;
  }
});
// 删
router.post('/delete', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, '参数id缺失');
  }
  try {
    await deleteArticle(id);
    resSuccess({ ctx, message: '删除文章成功' });
  } catch (error) {
    error.message = '文章删除失败';
    throw error;
  }
});

// 改
router.post('/edit', async (ctx, next) => {
  const { id, info } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, '参数id缺失');
  }
  try {
    await editArticle(id, info);
    resSuccess({ ctx, message: '修改文章成功' });
  } catch (error) {
    error.message = '文章修改失败';
    throw error;
  }
});

router.post('/edit_status', async (ctx, next) => {
  const { id, status } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, '参数id缺失');
  }
  try {
    await changeArticleStatus(id, status);
    resSuccess({ ctx, message: '修改文章状态成功' });
  } catch (error) {
    error.message = '修改文章状态失败';
    throw (error);
  }
});

router.post('/like', async (ctx, next) => {
  const { id } = ctx.request.body;
  if (!id) {
    return ctx.throw(500, '参数id缺失');
  }
  try {
    await likeArticle(id);
    resSuccess({ ctx, message: '喜欢文章成功' });
  } catch (error) {
    error.message = '喜欢文章失败';
    throw (error);
  }
});
// 查
router.get('/get', async (ctx, next) => {
  const { id } = ctx.query;
  if (!id) {
    return ctx.throw(500, '参数id 缺失');
  }
  try {
    const result = await getArticleById(id);
    resSuccess({ ctx, message: '查询文章成功', result });
  } catch (error) {
    error.message = '查询文章失败';
    throw error;
  }
});
// 分页获取文章
router.get('/getAll', async (ctx, next) => {
  const options = ctx.query;
  try {
    const articles = await getArtilesByPage(options);
    resSuccess({ ctx, result: articles, message: '分页查询文章成功' });
  } catch (error) {
    error.message = '分页查询文章失败';
    throw (error);
  }
});
// 分组文章
router.get("/group", async (ctx, next) => {
  try {
    const articles = await getArticlesByGroup();
    resSuccess({ ctx, result: articles, message: '获取分组文章成功' });
  } catch (error) {
    error.message = '获取分组文章失败';
    throw (error);
  }
});



module.exports = router;
