const Router = require("koa-router");
const router = new Router();
const request = require('../util/request.js');
const { resSuccess } = require("../util/resHandle");

router.get('/list', async (ctx, next) => {
    const { n = 8 } = ctx.request.body;
    const url = `https://cn.bing.com/HPImageArchive.aspx`;
    const qs = {
        format: 'js',
        idx: 0,
        n,
        mkt: 'zh-CN'
    };
    let result = await request.get(url, qs);
    resSuccess({ ctx, result: { list: result.images } });

});

module.exports = router;