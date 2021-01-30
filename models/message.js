const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
// 畅所欲言
const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    state: {
        type: Number,
        default: 1,
    },
    style: {
        fontsize: String,
        color: String
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
