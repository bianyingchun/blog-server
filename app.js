const Koa = require("koa");
const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const cors = require("koa2-cors");


const router = Router();
const app = new Koa();

const PORT = 3030;

// static
// app.use(koaStatic(path.resolve(__dirname, "../build")));

// routes

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
