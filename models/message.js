const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    ip: { type: String },
    city: { type: String },
    range: { type: String },
    country: { type: String },
    agent: { type: String },
    author: {
        gravatar: { type: String, default: "" },
        name: { type: String, required: true },
        email: { type: String, required: true },
        site: { type: String },
    },
    state: {
        type: Number,
        default: 1,
    },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
});

// 翻页配置
messageSchema.plugin(mongoosePaginate);

// 时间更新
messageSchema.pre("findOneAndUpdate", function (next) {
    this.findOneAndUpdate({}, { update_at: Date.now() });
    next();
});

// 标签模型
const message = mongoose.model("Message", messageSchema);

module.exports = message;
