const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
//点赞表
const likeSchema = new mongoose.Schema(
  {
    ct: {
      type: Date,
      default: Date.now,
    },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "graph" },
  },
  {
    timestamps: { createdAt: "ct" },
  }
);

// likeSchema.virtual('flink', {
//   ref:'user',
//   localField:'from',
//   foreignField: 'cid',
// });

// likeSchema.virtual('tlink', {
//   ref:'graph',
//   localField:'to',
//   foreignField: 'gid',
// });
likeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("like", likeSchema);
