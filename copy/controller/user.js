const User = require("../models/user");
const Like = require("../models/like");
const Graph = require("../models/graph");
const addUser = (info) => {
  return new User(info).save();
};

const findUser = (query) => User.findOne(query);

const findUserById = (id) => User.findById(id, { password: 0 });


const getLikedGraphs = async (id, opts) => {
  let { page = 1, limit = 10 } = opts;
  const options = {
    page: Number(page),
    limit: Number(limit),
    populate: ["to"],
    sort: { ct: -1 },
  };
  const query = { from: id };
  const result = await Like.paginate(query, options);
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    list: result.docs.map((item) => item.to),
  };
};

const getUserGraphs = async (id, opts) => {
  let { page = 1, limit = 10 } = opts;
  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { ct: -1 },
  };
  const query = {
    auth: id,
  };
  const result = await Graph.paginate(query, options);
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    list: result.docs,
  };
};

const editUser = (id, info) => User.findByIdAndUpdate(id, info, { new: true, select: {password:0}});
module.exports = {
  addUser,
  findUser,
  findUserById,
  getLikedGraphs,
  getUserGraphs,
  editUser
};
