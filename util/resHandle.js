const resError = ({ ctx, message = '请求失败', err = null }) => {
    ctx.body = { code: 0, message, err: err };
};

const resSuccess = ({ ctx, message = '请求成功', result = null }) => {
    ctx.body = { code: 1, message, result };
};

module.exports = {
    resError,
    resSuccess
};