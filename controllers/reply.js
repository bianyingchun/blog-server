const util = require('../util');
const Reply = require('../models/reply');
const Comment = require('../models/comment');

const addReply = async (ctx, reply) => {
    const ipInfo = util.parseIp(ctx.req);
    reply = Object.assign(reply, ipInfo);
    reply.agent = ctx.header['user-agent'] || reply.agent;
    // 发布评论回复
    const res = await (new Reply(reply)).save();
    // let permalink = 'https://blog.naice.me';
    // if (reply.post_id) {
    //     permalink = `https://blog.naice.me/article/${reply.post_id}`;
    // }
    // 让原来评论数+1
    const comment = await Comment.findByIdAndUpdate(reply.cid, { $inc: { 'reply': 1 } }, { new: true });
    // res.permalink = permalink;
    res.comment = comment;
    return res;
};

const deleteReply = async (id) => {
    const reply = Reply.findById(id);
    await Comment.findByIdAndUpdate(reply.cid, { $inc: { 'reply': -1 } });
    return await reply.remove();
};

const editReply = async (id, opt) => {
    return await Reply.findByIdAndUpdate(id, opt);
};

const likeReply = async (id) => {
    return await Reply.findByIdAndUpdate(id, { $inc: { 'likes': 1 } }, { new: true });
};

const getReplyByCid = async (opts = {}) => {
    let { cid, sort = -1, current_page = 1, page_size = 10, keyword = '', state } = opts;
    let result = {};
    const options = {
        page: Number(current_page),
        limit: Number(page_size)
    };
    sort = Number(sort);
    if ([1, -1].includes(sort)) {
        options.sort = { _id: sort };
    } else if (sort === 2) {
        options.sort = { likes: -1 };
    }
    const querys = { cid };
    if (state && ['0', '1', '2'].includes(state)) {
        querys.state = state;
    }
    if (keyword) {
        const keywordReg = new RegExp(keyword, 'i');
        querys['$or'] = [
            { 'content': keywordReg },
            { 'to.name': keywordReg },
            { 'to.email': keywordReg }
        ];
    }
    const replys = await Reply.paginate(querys, options);

    if (replys) {
        result = {
            pagination: {
                total: replys.total,
                current_page: options.page,
                total_page: replys.pages,
                per_page: options.limit
            },
            data: replys.docs
        };
    }
    return result;
};
// 更新评论状态
const changeReplyStatus = async (_id, state) => {
    return await Reply.findByIdAndUpdate(_id, { state });
};

module.exports = {
    addReply,
    deleteReply,
    editReply,
    likeReply,
    getReplyByCid,
    changeReplyStatus
};