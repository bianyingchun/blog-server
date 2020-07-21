const express = require("express");
const router = express.Router();
const { resError, resSuccess } = require("../util/resHandler");
const {
  addGraph,
  favGraph,
  unfavGraph,
  likeGraph,
  unlikeGraph,
  deleteGraph,
  getGraphList,
  getGraphDetail,
  editGraph,
  uncollectGraph,
  collectGraph,
  checkLiked,
  graphAddTag,
} = require("../controller/graph");

const { findAlbum } = require("../controller/album");
const { multer, uploadFile } = require("../util/upload");

// 分页获取
router.get("/list", async (req, res) => {
  const info = req.query;
  try {
    const result = await getGraphList(info);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

router.get("/detail", async (req, res) => {
  let { auth = req.uid, id } = req.query;
  console.log(auth);
  try {
    const result = await getGraphDetail(id, auth);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

router.post("/upload", multer.single("file"), async (req, res) => {
  if (!req.uid) return resError(res, { msg: "不合法参数" });
  try {
    let file = req.file;
    if (!file) {
      return resError(res, { code: 406, msg: "未获取到文件" });
    }
    let { filename, path } = file;
    let result = await uploadFile(path, filename);
    resSuccess(res, { url: result.url });
  } catch (err) {
    resError(res, err);
  }
});

router.post("/add", async (req, res) => {
  let {
    auth = req.uid,
    desc = "",
    title,
    preview,
    album,
    tags = [],
    auid,
    guid, //文件名
  } = req.body;
  try {
    if (!auth || (!album && !auid)) return resError(res, { msg: "不合法参数" });
    let info = { auth, desc, title, preview };
    if (!album) {
      const realAlbum = await findAlbum({ auth, uid: auid });
      if (!realAlbum) {
        return resError(res, {
          msg: "不存在该album",
          code: 406,
        });
      }
      album = realAlbum._id;
      if (guid) info.uid = realAlbum.name + "-" + guid;
    }
    const graph = await addGraph(info);
    await collectGraph(auth, graph._id, album, graph.uid);
    if (tags.length) {
      let ps = tags.map((tid) => graphAddTag(graph._id, tid));
      await Promise.all(ps);
    }
    resSuccess(res, graph);
  } catch (err) {
    resError(res, err);
  }
});

// 删除
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    await deleteGraph(id);
    resSuccess(res, { deleted: true });
  } catch (err) {
    resError(res, err);
  }
});
// 编辑
router.post("/edit", async (req, res) => {
  const { id, info } = req.body;
  if (!id) return resError(res, { msg: "不合法参数" });
  try {
    const result = await editGraph(id, info);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});
// 点赞
router.post("/like", async (req, res) => {
  const { id } = req.body;
  const uid = req.uid;
  if (!id || !uid) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    const isLiked = await checkLiked(uid, id);
    if (isLiked) {
      return resError(res, { msg: "该用户已赞" });
    }
    const newItem = await likeGraph(uid, id);
    resSuccess(res, newItem);
  } catch (err) {
    resError(res, err);
  }
});

// 取消点赞
router.post("/unlike", async (req, res) => {
  const { id } = req.body;
  const uid = req.uid;
  if (!id || !uid) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    const isLiked = await checkLiked(uid, id);
    if (!isLiked) {
      return resError(res, { msg: "该用户未赞" });
    }
    const newItem = await unlikeGraph(uid, id);
    resSuccess(res, newItem);
  } catch (err) {
    resError(res, err);
  }
});

// todo test 收藏到具体文件夹
// 收藏到收藏夹，没有folder则为默认收藏夹
router.post("/fav", async (req, res) => {
  const { id, folder } = req.body;
  const uid = req.uid;
  if (!id || !uid) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    await favGraph(uid, id, folder);
    resSuccess(res, { faved: true });
  } catch (err) {
    resError(res, err);
  }
});

// 取消收藏，
router.post("/unfav", async (req, res) => {
  const { id, folder } = req.body;
  const uid = req.uid;
  if (!id || !uid) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    await unfavGraph(uid, id, folder);
    resSuccess(res, { unfaved: true });
  } catch (err) {
    resError(res, err);
  }
});

// todo from 参数改为 req.uid
// 收录到 album
router.post("/collect", async (req, res) => {
  const { from = req.uid, to, album } = req.body;
  if (!from || !to || album) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    await collectGraph(from, to, album);
    resSuccess(res, { collect: true });
  } catch (err) {
    resError(res, err);
  }
});

// 取消收藏，
router.post("/uncollect", async (req, res) => {
  const { from = req.uid, to, album } = req.body;
  if (!from || !to || album) {
    return resError(res, { msg: "不合法参数" });
  }
  try {
    await uncollectGraph(from, to, album);
    resSuccess(res, { uncollect: true });
  } catch (err) {
    resError(res, err);
  }
});

module.exports = router;
// 5ed0a9bfd36cd820a81674a7 gid
