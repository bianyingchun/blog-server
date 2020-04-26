const Koa = require("koa");
const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const cors = require("koa2-cors");
const config = require("./config");
const db = require("./db");

const router = Router();
const app = new Koa();
db.connect();

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.APP.PORT, () => {
  console.log(`http://localhost:${config.APP.PORT}`);
});
