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

// {
//   "code": 1,
//   "message": "登录成功",
//   "result": {
//       "refreshtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxNTkxMjc0NTg1MzI1LCJkYXRhIjoiNWVkN2JiNjY3ZmJiOWU1MzM0NTM4MzI2IiwiaWF0IjoxNTkxMjc0NTg1LCJleHAiOjE1OTE4NzkzODV9.RAVNLiMXjeONJmwXmmaRlKJOsLqMyB3eeZ42n-WGNpU",
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxNTkxMjc0NTg1MzI1LCJkYXRhIjoiNWVkN2JiNjY3ZmJiOWU1MzM0NTM4MzI2IiwiaWF0IjoxNTkxMjc0NTg1LCJleHAiOjE1OTEyNzU0ODV9.nvP9nvxnzkbAZjknCxr1-2a3Sl7_B23pbZNYFQnCD5Q"
//   }
// }