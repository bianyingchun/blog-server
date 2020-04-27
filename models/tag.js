const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: String,
    create_at: { type: Date, default: Date.now },
    // 最后修改日期
    update_at: { type: Date, default: Date.now },
    sort: { type: Number, default: 0 }
});

// 翻页
tagSchema.plugin(mongoosePaginate);

// 时间更新
tagSchema.pre('findOneAndUpdate', function (next) {
    this.findOneAndUpdate({}, { update_at: Date.now() });
    next();
});
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;