const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var graphSchema = new mongoose.Schema(
  {
    preview: {
      url: String,
      height: Number,
      width: Number,
    },
    title: String,
    desc: String,
    auth: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    ct: {
      //创建时间
      type: Date,
      default: Date.now,
    },
    et: {
      //修改时间
      type: Date,
      default: Date.now,
    },
    // 公开程度 0|1
    publish: {
      type: Number,
      default: 1,
    },
    // 状态 0|1|2 待审核， 审核通过，审核未通过
    state: {
      type: Number,
      default: 0,
    },
    meta: {
      shares: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      favs: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
    },
    // 用户自定义id
    uid: String,
  },
  {
    timestamps: { createdAt: "ct", updatedAt: "et" },
  }
);

graphSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("graph", graphSchema);
