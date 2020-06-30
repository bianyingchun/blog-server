const Router = require('koa-router');
const router = new Router();
const { resSuccess } = require('../util/resHandle');
const { addTag, getTags, editTag, deleteTag } = require('../controllers/tag');

router.post('/add', async (ctx, next) => {
    const { name, desc = '' } = ctx.request.body;
    try {
        const tag = await addTag({ name, desc });
        resSuccess({ ctx, message: '添加标签成功', result: tag });
    } catch (error) {
        error.message = '添加标签失败';
        throw (error);
    }
});

router.post('/delete', async (ctx, next) => {
    const { id } = ctx.request.body;
    try {
        await deleteTag(id);
        resSuccess({ ctx, message: '删除标签成功' });
    } catch (error) {
        error.message = '删除标签失败';
        throw (error);
    }
});

router.post('/edit', async (ctx, next) => {
    const { id, name, desc } = ctx.request.body;
    if (!id) {
        return ctx.throw(500, '参数id缺失');
    }
    try {
        await editTag({ id, name, desc });
        resSuccess({ ctx, message: '标签修改成功' });
    } catch (error) {
        error.message = '标签修改失败';
        throw (error);
    }
});

// todo  将getALL(不分页) 和 list(全部)的 路由名交换
router.get('/list', async (ctx) => {
    try {
        const tags = await getTags(ctx.query);
        resSuccess({ ctx, message: "获取所有标签成功", result: tags });
    } catch (error) {
        error.message = '获取所有标签失败';
        throw (error);
    }
});


module.exports = router;