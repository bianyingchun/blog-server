const Message = require("../models/message");

const addMessage = (message) => new Message(message).save();

const deleteMessage = (id) => Message.findByIdAndRemove(id);

const editMessage = async (id, opt) => Message.findByIdAndUpdate(id, opt, { new: true });

const getMessageByPage = async (opts = {}) => {
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
            { content: keywordReg }
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
const getAllMessage = () => Message.find({});

module.exports = {
    addMessage,
    editMessage,
    deleteMessage,
    getMessageByPage,
    getAllMessage
};
