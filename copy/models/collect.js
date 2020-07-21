const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
//收录到album
const collectSchema = new mongoose.Schema(
  {
    //收录者
    from: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    // 收录目标
    to: { type: mongoose.Schema.Types.ObjectId, ref: "graph" },
    // 收录到的文件夹
    album: { type: mongoose.Schema.Types.ObjectId, ref: "album" },
    ct: {
      //创建时间
      type: Date,
      default: Date.now,
    },
    et: {
      type: Date,
      default: Date.now,
    },
    // 收录目标的uid
    touid:String
  },
  {
    timestamps: {
      createdAt: "ct",
      updatedAt: "et",
    },
  }
);

collectSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("collect", collectSchema);
