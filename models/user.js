// 权限和用户数据模型
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // 名字
  username: { type: String, required: true },
  // 密码
  password: {
    type: String,
    required: true,
  },
  // 签名
  desc: String,
  // 头像
  avatar: String,
  // 角色权限
  // 0 ,普通用户 1,管理员
  role: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
