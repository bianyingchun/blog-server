const express = require("express");
const router = express.Router();
const { resError, resSuccess } = require("../util/resHandler");

const {
  addAlbum,
  deleteAlbum,
  editAlbum,
  getContent,
  findAlbum,
  findAlbumById,
  getAlbumByPage,
  findAll,
  getTopAlbum,
} = require("../controller/album");

// 创建收藏夹
// 防止同一文件夹下出现同名
router.post("/add", async (req, res) => {
  const { name, desc, auth = req.uid } = req.body;
  if (!auth) return resError(res, { msg: "不合法参数" });
  try {
    const hasAlbum = await findAlbum({ name, auth });
    if (hasAlbum) {
      resError(res, { msg: "该albumn已存在", code: 406 });
    } else {
      const album = await addAlbum({ name, desc, auth, uid: name });
      resSuccess(res, album);
    }
  } catch (err) {
    resError(res, err);
  }
});

// 删除
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await deleteAlbum(id);
    resSuccess(res, { deleted: "ok" });
  } catch (err) {
    resError(res, err);
  }
});

// 编辑
router.post("/edit", async (req, res) => {
  const { id, info } = req.body;
  try {
    const result = await editAlbum(id, info);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

// 获取fav-item 列表
router.get("/list", async (req, res) => {
  const info = req.query;
  try {
    const result = await getAlbumByPage(info);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

// 内容详情
router.get("/detail", async (req, res) => {
  const { id } = req.query;
  try {
    const info = await findAlbumById(id);
    resSuccess(res, info);
  } catch (err) {
    resError(res, err);
  }
});

router.get("/content", async (req, res) => {
  const { id, opts } = req.query;
  try {
    const result = await getContent({ id }, opts);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const result = await findAll();
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

// 置顶列表
router.get("/top", async (req, res) => {
  try {
    const result = await getTopAlbum();
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});


module.exports = router;
