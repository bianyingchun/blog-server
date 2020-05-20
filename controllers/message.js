const Message = require("../models/message");
const util = require("../util");

const addMessage = (ctx, message) => {
    const ipInfo = util.parseIp(ctx.request);
    message = Object.assign(message, ipInfo);
    message.agent = ctx.header["user-agent"] || message.agent;
    return Message(message).save();
};

const deleteMessage = (id) => {
    return Message.findByIdAndRemove(id);
};

const editMessage = async (id, opt) => {
    return Message.findByIdAndUpdate(id, opt, { new: true });
};

const getMessage = async (opts = {}) => {
    let {
        current_page = 1,
        page_size = 10,
        keyword = "",
        state,
    } = opts;
    let result = {};
    const options = {
        sort: { _id: -1 },
        page: Number(current_page),
        limit: Number(page_size),
    };
    const querys = {};
    if (state && ["0", "1", "2"].includes(state)) {
        querys.state = Number(state);
    }
    if (keyword) {
        const keywordReg = new RegExp(keyword, "i");
        querys["$or"] = [
            { content: keywordReg },
            { "author.name": keywordReg },
            { "author.email": keywordReg },
        ];
    }
    const messages = await Message.paginate(querys, options);

    if (messages) {
        result = {
            pagination: {
                total: messages.total,
                current_page: options.page,
                total_page: messages.pages,
                per_page: options.limit,
            },
            list: messages.docs,
        };
    }
    return result;
};
module.exports = {
    addMessage,
    editMessage,
    deleteMessage,
    getMessage,
};
