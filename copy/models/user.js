const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  // cid:String,
  avatarUrl: String,
  unionid: String,
  openid: String,
  tel: String, //手机号
  desc: {
    type: String,
    default: "",
  },
  sex: {
    //普通用户性别，1为男性，2为女性
    type: Number,
    default: 1,
  },
  city: {
    type: String,
    default: "",
  },
  province: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  // 用户权限 0:普通，1:管理员
  role: {
    type: Number,
    default: 0,
  },
});
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("user", userSchema);
