const verifyParams = (params) => async (ctx, next) => {
  const { body } = ctx.request;
  let errors = [];
  for (let i = 0; i < params.length; i++) {
    let attr = params[i];
    if (!Object.prototype.hasOwnProperty.call(body, attr)) {
      errors.push(attr);
    }
  }
  if (errors.length > 0) {
    ctx.throw(412, `${errors.join(", ")} 参数缺失`);
  }
  await next();
};
module.exports = verifyParams;
