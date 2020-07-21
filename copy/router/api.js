const express = require("express");
const router = express.Router();
const { getFile } = require("../util/oss");
const { getFilename, removeFile } = require("../util");
const { resError, resSuccess } = require("../util/resHandler");
const { tmpDir } = require("../config");

const { multer, uploadFile } = require("../util/upload");
router.post("/download", async (req, res) => {
  let urls = req.body.urls;
  try {
    let localFiles = [];
    let ps = urls.map((url) => {
      let filename = getFilename(url);
      localFiles.push("/tmp/" + filename);
      return getFile(filename, tmpDir);
    });
    await Promise.all(ps);
    resSuccess(res, localFiles);
  } catch (err) {
    resError(res, err);
  }
});

router.post("/removetmp", async (req, res) => {
  let files = req.body.files;
  try {
    let ps = files.map((file) => {
      file = tmpDir + "/" + getFilename(file);
      removeFile(file);
    });
    await Promise.all(ps);
    resSuccess(res, { removed: true });
  } catch (err) {
    resError(res, err);
  }
});

router.post("/upload", multer.single("file"), async (req, res) => {
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

module.exports = router;
