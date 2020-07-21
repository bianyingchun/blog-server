const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
//album
const albumSchema = new mongoose.Schema(
  {
    name: {
      //名称
      type: String,
      default: "",
    },
    // 描述
    desc: {
      type: String,
      default: "",
    },
    // 公开程度 0|1
    publish: {
      type: Number,
      default: 1,
    },
    // 创建者
    auth: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    //创建时间
    ct: {
      type: Date,
      default: Date.now,
    },
    // 更新时间
    et: {
      type: Date,
      default: Date.now,
    },
    // 用户自定义id
    uid: String
  },
  {
    timestamps: {
      createdAt: "ct",
      updatedAt: "et",
    },
  }
);

albumSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("album", albumSchema);
