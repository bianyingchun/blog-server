const express = require("express");
const router = express.Router();
const { resError, resSuccess } = require("../util/resHandler");
const {
  addFolder,
  deleteFolder,
  editFolder,
  getChildren,
  getList,
  findFolder,
  findFolderById,
} = require("../controller/folder");

const { defaultUser } = require('../config')

// 创建收藏夹
// 防止同一文件夹下出现同名
router.post("/add", async (req, res) => {
  const { parent, name, desc, auth = defaultUser } = req.body;
  try {
    const hasFolder = await findFolder({ parent, name, auth });
    if (hasFolder) {
      resError(res, { msg: "该目录下已存在同名文件夹", code: 406 });
    } else {
      const folder = await addFolder({ parent, name, desc, auth });
      resSuccess(res, folder);
    }
  } catch (err) {
    resError(res, err);
  }
});

// 删除
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await deleteFolder(id);
    resSuccess(res, { deleted: "ok" });
  } catch (err) {
    resError(res, err);
  }
});

// 编辑
router.post("/edit", async (req, res) => {
  const { id, info } = req.body;
  try {
    const result = await editFolder(id, info);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

// 获取子文件夹列表,根文件夹列表，即 parent = null/undefined
router.get("/children", async (req, res) => {
  const parent = req.query.id;
  try {
    const result = await getChildren(parent);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

// 获取fav-item 列表
router.get("/list", async (req, res) => {
  const folder = req.query.id;
  try {
    const result = await getList(folder);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

// 文件夹内容详情
router.get("/detail", async (req, res) => {
  const fid = req.query.id;
  try {
    const ps = [findFolderById(fid), getChildren(fid), getList(fid)];
    const result = await Promise.all(ps);
    let info = result[0];
    info.folders = result[1];
    info.files = result[2].map((item) => item.to);
    resSuccess(res, info);
  } catch (err) {
    resError(res, err);
  }
});


module.exports = router;
