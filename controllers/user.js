const User = require("../models/user");

const addUser = async (userInfo) => {
  return await (new User(userInfo)).save();
};

const findUser = (username) => User.findOne({ username });

const getUserInfo = (id) => User.findById(id, { password: 0 });

module.exports = {
  addUser,
  findUser,
  getUserInfo,
};
