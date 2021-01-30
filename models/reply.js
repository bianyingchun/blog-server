const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const replySchema = new mongoose.Schema({
  // 评论所在的文章_id
  // TODO 占坑，post_id存在似乎没必要，只要依据cid，就可以得到评论回复列表，
  // 评论的post_id与文章关联，这样就可得到每篇文章的每条评论回复了，kkkk
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "article",
    required: true,
  },
  // cid，评论_id
  cid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  from: {
    // 头像
    gravatar: { type: String, default: "" },
    // 用户名
    name: { type: String, required: true },
    // 邮箱
    email: { type: String, required: true },
    // 网站
    site: { type: String },
  },
  to: {
    // 头像
    gravatar: { type: String },
    // 用户名
    name: { type: String },
    // 邮箱
    email: { type: String },
    // 网站
    site: { type: String },
  },
  // content
  content: { type: String, required: true },
  // 被赞数
  likes: { type: Number, default: 0 },
  // ip
  ip: { type: String },
  // ip 物理地址
  city: { type: String },
  range: { type: String },
  country: { type: String },
  // 用户ua
  agent: { type: String },
  // 状态 0待审核 1通过正常 2不通过
  state: { type: Number, default: 1 },
  // 发布日期
  create_at: { type: Date, default: Date.now },
  // 最后修改日期
  update_at: { type: Date, default: Date.now },
});

// 翻页
replySchema.plugin(mongoosePaginate);

// 时间更新
replySchema.pre("findOneAndUpdate", function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});

module.exports = mongoose.model("Reply", replySchema);
