const resError = ({ ctx, message = '请求失败', err = null, code = 500 }) => {
    ctx.body = { code, message, err: err };
};

const resSuccess = ({ ctx, message = '请求成功', result = null, code = 200 }) => {
    ctx.body = { code, message, result };
};

module.exports = {
    resError,
    resSuccess
};