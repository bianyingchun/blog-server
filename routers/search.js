const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");

router.get('/hot', async (ctx) => {
    resSuccess({
        ctx, message: '获取热门搜索成功',
        result: [
            'NodeJs',
            "css3",
            "flutter",
            "算法",
            "leetCode"
        ]
    });
});

module.exports = router;