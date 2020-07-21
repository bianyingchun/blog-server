const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

// 全局tag体系
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    //名称
    desc: {
      type: String,
      default: "",
    },
    preview:String,
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tag",
    },

    // 公开程度 0|1
    publish: {
      type: Number,
      default: 1,
    },

    //创建者，管理员 or 用户 ？先占位吧
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    ct: {
      //创建时间
      type: Date,
      default: Date.now,
    },
    et: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: "ct",
      updatedAt: "et",
    },
  }
);

tagSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("tag", tagSchema);
