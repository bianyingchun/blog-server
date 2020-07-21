const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
//收藏夹
const folderSchema = new mongoose.Schema(
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
    // 父文件夹
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "folder",
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
  },
  {
    timestamps: {
      createdAt: "ct",
      updatedAt: "et",
    },
    // toJSON: { virtuals: true }
  }
);

// folderSchema.virtual('auth_link', {
//   ref:'user',
//   localField:'auth',
//   foreignField: 'cid',
//   justOne:true
// });

// folderSchema.virtual('content_link', {
//   ref:'graph',
//   localField:'content',
//   foreignField: 'gid',
//   justOne:false
// });
folderSchema.plugin(mongoosePaginate);
module.exports = folderSchema;

module.exports = mongoose.model("folder", folderSchema);
