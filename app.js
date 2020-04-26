const Koa = require("koa");
const Router = require("koa-router");
const config = require("./config");

const db = require("./db");
const middlewares = require('./middlewares');
const router = Router();
const app = new Koa();
db.connect();

middlewares();

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.APP.PORT, () => {
    console.log(`http://localhost:${config.APP.PORT}`);
});
