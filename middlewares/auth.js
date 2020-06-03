const { verifyToken } = require('../util');

const auth = () => async (ctx, next) => {
    if (!_jumpAuth(ctx.request.url)) {
        if (ctx.header && ctx.header.authorization) {
            const parts = ctx.header.authorization.split(' ');
            if (parts.length === 2) {
                const schema = parts[0];
                const token = parts[1];
                if (schema === 'Bearer') {
                    try {
                        ctx.userId = await verifyToken(token);
                        return await next();
                    } catch (err) {
                        ctx.throw(402, 'token 已过期');
                    }
                }
            }
        }
        ctx.throw(403, "拒绝访问");
    } else {
        await next();
    }
};

const _jumpAuth = (path) => {
    return ['/user/login', '/user/reg', '/user/refresh'].some(item => item.indexOf(path) !== -1);
};

module.exports = auth;