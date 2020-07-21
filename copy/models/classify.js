const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
//为graph 添加标签
const classifySchema = new mongoose.Schema(
  {
    // 分类目标
    item: { type: mongoose.Schema.Types.ObjectId, ref: "graph" },
    // 类名
    tag: { type: mongoose.Schema.Types.ObjectId, ref: "tag" },
    ct: {
      //创建时间
      type: Date,
      default: Date.now,
    },
    et: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: {
      createdAt: "ct",
      updatedAt: "et",
    },
  }
);

classifySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("classify", classifySchema);
//tag-classify
//floder-fav
//album-collect
