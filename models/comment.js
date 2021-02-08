const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const commentSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "article",
    require: true,
  },
  // 文章标题
  post_title: { type: String },
  pid: { type: Number, default: 0 },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  ip: { type: String },
  city: { type: String },
  range: { type: String },
  country: { type: String },
  agent: { type: String },
  from: {
    gravatar: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    site: { type: String },
  },
  state: {
    type: Number,
    default: 1,
  },
  reply: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
});

// 翻页配置
commentSchema.plugin(mongoosePaginate);

// 时间更新
commentSchema.pre("findOneAndUpdate", function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() });
  next();
});

// 标签模型
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
