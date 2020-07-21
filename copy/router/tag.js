const express = require("express");
const router = express.Router();
const { resError, resSuccess } = require("../util/resHandler");
const {
  findTag,
  editTag,
  getContent,
  getList,
  deleteTag,
  addTag,
  getRootTags,
  findTagById,
} = require("../controller/tag");

router.post("/add", async (req, res) => {
  const {
    parent = null,
    name,
    desc,
    preview = "",
    auth = req.uid,
    publish = 1,
  } = req.body;
  if (!auth) return resError(res, { msg: "不合法参数" });
  try {
    let tag = await findTag({ parent, name, auth });
    if (tag) {
      resError(res, { msg: "该标签已存在", code: 406 });
    } else {
      tag = await addTag({ parent, name, desc, auth, publish, preview });
      resSuccess(res, tag);
    }
  } catch (err) {
    resError(res, err);
  }
});

// 删除
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  if (!id) return resError(res, { msg: "不合法参数" });
  try {
    await deleteTag(id);
    resSuccess(res, { deleted: "ok" });
  } catch (err) {
    resError(res, err);
  }
});

// 编辑
router.post("/edit", async (req, res) => {
  const { id, info } = req.body;
  try {
    const result = await editTag(id, info);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

// 获取子标签列表, 根标签列表，即 parent = null/undefined
router.get("/list", async (req, res) => {
  const { parent, opts } = req.query;
  try {
    const result = await getList(parent, opts);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

router.get("/root", async (req, res) => {
  try {
    const result = await getRootTags(req, res);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

router.get("/content", async (req, res) => {
  const { id, opts } = req.query;
  if (!id) return resError(res, { msg: "不合法参数" });
  try {
    const result = await getContent(id, opts);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

router.get("/detail", async (req, res) => {
  const { id } = req.query;
  if (!id) return resError(res, { msg: "不合法参数" });
  try {
    const result = await findTagById(id);
    resSuccess(res, result);
  } catch (err) {
    resError(res, err);
  }
});

module.exports = router;
