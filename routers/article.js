const Router = require("koa-router");
const router = new Router();
router.get("/", function (ctx, next) {
  ctx.body = "article";
});

router.get("/info", function (ctx, next) {
  ctx.body = "article info";
});

module.exports = router;
