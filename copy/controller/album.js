const Album = require("../models/album");
const Collect = require("../models/collect");

const Setting = require("../config/setting.json");
// 创建album
const addAlbum = (info) => new Album(info).save();
//查找
const findAlbum = (info) => Album.findOne(info);
// 删除album
const deleteAlbum = async (id) => {
  let ps = [
    Album.findByIdAndDelete(id, { new: true }),
    Collect.deleteMany({ album: id }),
  ];
  let result = await Promise.all(ps);
  return result;
};

// 更新, todo 检测重名
const editAlbum = (id, info) =>
  Album.findByIdAndUpdate(id, info, { new: true });

// 获取该album下的项目
const getContent = async (obj, opts = {}) => {
  let { id, uid } = obj;
  const { page = 1, limit = 10 } = opts;
  const options = {
    page: Number(page),
    limit: Number(limit),
    populate: ["to"],
    select: "to",
    sort: { et: -1 },
  };

  let query = { album: id };
  if (!uid) {
    const album = await findAlbumById(id);
    uid = album.uid;
  }
  if (uid && Setting.top.albums[uid]) {
    const filters = Setting.top.albums[uid].concat(Setting.hide.graph);
    query.touid = { $nin: filters };
  }
  let docs = [];
  if (options.page === 1 && uid) {
    docs = await getTopContent(id, uid);
  }
  const result = await Collect.paginate(query, options);
  docs = docs.concat(result.docs);
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    list: docs.map((item) => item.to),
  };
};
// 首页album推荐列表
const getRecommendAlbum = async (recTopAlbum, opts = {}) => {
  const { page = 1, limit = 10 } = opts;
  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { et: -1 },
  };
  const filterList = Setting.hide.album.concat(recTopAlbum);
  const query = { uid: { $nin: filterList } };
  const result = await Album.paginate(query, options);
  let docs = result.docs;
  const list = await _dealAlbumList(docs);
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    list,
  };
};

const getAlbumByPage = async (opts = {}) => {
  const { page = 1, limit = 10 } = opts;
  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { et: -1 },
  };

  const filterList = Setting.hide.album.concat(Setting.top.album_list);
  const query = { uid: { $nin: filterList } };
  let docs = [];
  if (options.page === 1) {
    docs = await _getTopList();
  }
  const result = await Album.paginate(query, options);
  docs = docs.concat(result.docs);
  const list = await _dealAlbumList(docs);
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    list,
  };
};

const _dealAlbumList = async (docs) => {
  const ps = [];
  let list = docs.map((item) => {
    ps.push(getContent(item));
    return { _id: item._id, desc: item.desc, name: item.name, uid: item.uid };
  });
  const res = await Promise.all(ps);
  res.forEach((item, index) => {
    list[index].content = item;
  });
  return list;
};
const findAlbumById = async (id) => {
  return await Album.findById(id).lean();
};

// 置顶 albums
const _getTopList = async (topSetting = Setting.top.album_list) => {
  return await Album.find({
    uid: { $in: topSetting, $nin: Setting.hide.album },
  });
};

const getTopAlbum = async (topSetting) => {
  let docs = await _getTopList(topSetting);
  const list = await _dealAlbumList(docs);
  return list;
};
// album 下置顶graphs
const getTopContent = async (id, uid) => {
  const topSetting = Setting.top.albums[uid];
  if (topSetting) {
    const query = {
      album: id,
      touid: { $in: topSetting, $nin: Setting.hide.graph }
    };
    return await Collect.find(query).populate("to");
  }
  return [];
};

const countAlbum = async (query = {}, filterList) => {
  query.uid = { $nin: Setting.hide.album.concat(filterList) };
  return await Album.countDocuments(query);
};
const findAll = () => Album.find({}).sort({ ct: -1 });

const clearAlbum = () =>
  Promise.all([Album.deleteMany({}), Collect.deleteMany({})]);

module.exports = {
  addAlbum,
  deleteAlbum,
  editAlbum,
  getContent,
  findAlbum,
  findAlbumById,
  getAlbumByPage,
  findAll,
  countAlbum,
  getTopAlbum,
  getRecommendAlbum,
  clearAlbum,
};
