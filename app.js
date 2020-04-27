const Koa = require("koa");
const config = require("./config");
const db = require("./db");
const middlewares = require("./middlewares");

const app = new Koa();
db.connect();
middlewares(app);

app.listen(config.APP.PORT, () => {
  console.log(`http://localhost:${config.APP.PORT}`);
});
