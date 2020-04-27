const Router = require("koa-router");
const router = new Router();
router.get("/", function (ctx, next) {
  ctx.body = "home";
});

router.get("/info", function (ctx, next) {
  ctx.body = "home info";
});

module.exports = router;
