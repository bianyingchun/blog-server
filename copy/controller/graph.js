const Graph = require("../models/graph");
const Fav = require("../models/fav");
const Like = require("../models/like");
const Collect = require("../models/collect");
const Album = require("../models/album");
const graph = require("../models/graph");
const Classify = require("../models/classify");
const { getImageInfo } = require("../util/oss");

const hideConfig = require("../config/setting.json").hide;
const addGraph = async (info) => {
  let url = info.preview;
  if (url) {
    let imgInfo = await getImageInfo(url);
    info.preview = {
      url,
      width: imgInfo.width,
      height: imgInfo.height,
    };
  }
  return await new Graph(info).save();
};
// 更新
const editGraph = async (id, info) => {
  let { desc, title, preview, album, tags } = info;
  let newObj = {};
  if (desc) {
    newObj.desc = desc;
  }
  if (title) {
    newObj.title = title;
  }
  if (preview !== undefined) {
    if (preview) {
      let imgInfo = await getImageInfo(preview);
      newObj.preview = {
        url: preview,
        width: imgInfo.width,
        height: imgInfo.height,
      };
    }
    newObj.preview = null;
  }
  let task = [Graph.findByIdAndUpdate(id, newObj)];
  if (album) {
    task.push(graphUpdateAlbum(id, album));
  }
  if (tags) {
    task.push(graphUpdateTags(id, tags));
  }
  let res = await Promise.all(task);
  return res;
};

const deleteGraph = async (id) => {
  const ps = [
    Graph.findByIdAndDelete(id),
    Collect.deleteMany({ to: id }),
    // Fav.deleteMany({ to: id }),
    Like.deleteMany({ to: id }),
    Classify.deleteMany({ item: id }),
  ];
  let result = await Promise.all(ps);
  return result;
};
// 收藏
const favGraph = async (from, to, folder) => {
  const info = { from, to };
  if (folder) {
    info.folder = folder;
  }
  const isFaved = await checkFaved(from, to);
  await new Fav(info).save();
  if (isFaved) return;
  return await Graph.findByIdAndUpdate(to, {
    $inc: { "meta.favs": 1 },
  });
};
// 取消收藏
const unfavGraph = async (from, to, folder) => {
  const info = { from, to };
  if (folder) info.folder = folder;
  await Fav.findOneAndDelete(info);
  const isFaved = await checkFaved(from, to);
  if (isFaved) return;
  return await Graph.findByIdAndUpdate(to, {
    $inc: { "meta.favs": -1 },
  });
};

// 收录到album
const collectGraph = async (from, to, album, touid = "") => {
  await new Collect({ from, to, album, touid }).save();
  return await Album.findByIdAndUpdate(album, { et: Date.now() });
};

const uncollectGraph = (from, to, album) =>
  Collect.findOneAndDelete({ from, to, album });
// 点赞
const likeGraph = async (from, to) => {
  const info = { from, to };
  await new Like(info).save();
  return await Graph.findByIdAndUpdate(
    to,
    {
      $inc: { "meta.likes": 1 },
    },
    { new: true }
  );
};
// 取消点赞
const unlikeGraph = async (from, to) => {
  await Like.findOneAndDelete({ from, to });
  return await Graph.findByIdAndUpdate(
    to,
    {
      $inc: { "meta.likes": -1 },
    },
    { new: true }
  );
};

// todo 设置默认状态，公开程度 (客户端只能获取state=1, publish=1)
const getGraphList = async (opts = {}, topSetting = []) => {
  const { page = 1, limit = 10, auth, state, publish } = opts;
  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { et: -1 },
  };
  const querys = {
    uid: { $nin: hideConfig.graph.concat(topSetting) },
  };
  if (auth !== undefined) {
    querys.auth = auth;
  }
  if (state !== undefined) {
    querys.state = Number(state);
  }
  if (publish !== undefined) {
    querys.publish = Number(publish);
  }

  const result = await Graph.paginate(querys, options);
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    list: result.docs,
  };
};

const getRecommendGraph = (recTopGraph, opts) =>
  getGraphList(opts, recTopGraph);

// 用户收藏列表
// const getAllFavs = async (uid) => {
//   const list = await Fav.find({ from: uid });
//   return list.map((item) => item._id);
// };
// 详情
const getGraphDetail = async (id, auth) => {
  let basePs = [
    Graph.findByIdAndUpdate(
      id,
      {
        $inc: { "meta.views": 1 },
      },
      { new: true }
    )
      .populate("auth", { password: 0 })
      .lean(),
    getTags(id),
    getBelongAlbum(id),
  ];
  let res = await Promise.all(basePs);
  const data = res[0];
  data.tags = res[1];
  data.album = res[2];
  if (auth) {
    const ps = [checkFaved(auth, id), checkLiked(auth, id)];
    res = await Promise.all(ps);
    data.isFaved = res[0];
    data.isLiked = res[1];
  }
  return data;
};

// temp 获取所在album（标签）
const getBelongAlbumList = async (id) => {
  const list = await Collect.find({ to: id });
  return list.map((item) => item.album);
};
const getBelongAlbum = async (id) => {
  const res = await Collect.findOne({ to: id }).populate("album");
  if (res) {
    return res.album;
  }
  return null;
};

// 检测用户是否已赞或收藏
const checkFaved = async (from, to, folder) => {
  const query = { from, to };
  if (folder) query.folder = folder;
  const res = await Fav.findOne(query);
  return !!res;
};

const checkLiked = async (from, to) => {
  const res = await Like.findOne({ from, to });
  return !!res;
};

const countGraph = async (query = {}, filterList = []) => {
  query.uid = { $nin: hideConfig.graph.concat(filterList) };
  return await Graph.countDocuments(query);
};
// const checkCollected = async (from, to, album)=>{
//   const query = { from, to };
//   if (album) query.album = album;
//   const res = await Collect.findOne(query);
//   return !!res;
// }

// 置顶 graph
const getTopGraph = async (topSetting = []) => {
  return await graph.find({ uid: { $in: topSetting, $nin: hideConfig.graph } });
};

// 为graph添加标签
const graphAddTag = (gid, tid) => new Classify({ item: gid, tag: tid }).save();

// 移除标签
const graphRemoveTag = (gid, tid) =>
  Classify.findOneAndDelete({ item: gid, tag: tid });

// 批量更新标签
const graphUpdateTags = async (gid, tags) => {
  await Classify.deleteMany({ item: gid });
  let ps = tags.map((tid) => graphAddTag(gid, tid));
  await Promise.all(ps);
};
// 更新album
const graphUpdateAlbum = async (gid, album, touid = "") => {
  await Collect.findOneAndUpdate({ to: gid }, { album, touid });
  return await Album.findByIdAndUpdate(album, { et: Date.now() });
};
// 获取graph的标签
const getTags = async (id) => {
  let list = await Classify.find({ item: id }).populate("tag");
  return list.map((item) => item.tag);
};

// 清空
const clearGraph = () => Graph.deleteMany({});

module.exports = {
  addGraph,
  favGraph,
  likeGraph,
  unlikeGraph,
  unfavGraph,
  deleteGraph,
  getGraphList,
  getGraphDetail,
  editGraph,
  uncollectGraph,
  collectGraph,
  countGraph,
  getTopGraph,
  clearGraph,
  getRecommendGraph,
  graphAddTag,
  graphRemoveTag,
  checkFaved,
  checkLiked,
  getBelongAlbum,
};

// todo 级联删除更新
// http://www.voidcn.com/article/p-osupynxn-bsx.html
