const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        requied: true
    },
    keywords: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    content: {
        type: String,
        required: true
    },
    editContent: {
        type: String,
        required: true,
    },
    // 状态 1 发布 2 草稿
    state: {
        type: Number,
        default: 1
    },
    // 文章公开状态 1 公开 2 私密
    publish: {
        type: Number,
        default: 1
    },
    thumb: String,
    // 文章分类
    // Original: 0, // 原创
    // Reprint: 1, // 转载
    // Hybrid: 2 // 混合
    type: {
        type: Number,
        default: 0
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    },

    meta: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 }
    }
});

articleSchema.plugin(mongoosePaginate);

articleSchema.pre('findOneAndUpdate', function (next) {
    this.findOneAndUpdate({}, { update_at: Date.now() });
    next();
});

const Article = mongoose.model('article', articleSchema);
module.exports = Article;