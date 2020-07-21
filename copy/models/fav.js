const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
//收藏表
const favSchema = new mongoose.Schema(
  {
    // 收藏者
    from: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    // 收藏目标
    to: { type: mongoose.Schema.Types.ObjectId, ref: "graph" },
    // 收藏到的文件夹
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "folder" },
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
    // toJSON: { virtuals: true }
  }
);

// favSchema.virtual('auth_link', {
//   ref:'user',
//   localField:'auth',
//   foreignField: 'cid',
//   justOne:true
// });

// favSchema.virtual('content_link', {
//   ref:'graph',
//   localField:'content',
//   foreignField: 'gid',
//   justOne:false
// });

favSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("fav", favSchema);
