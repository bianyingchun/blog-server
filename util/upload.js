const multer = require("koa-multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public"));
  },
  filename: (req, file, cb) => {
    const name = file.originalname;
    const type = name.substring(name.lastIndexOf(".") + 1);
    cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`);
  },
});

//文件上传限制
const limits = {
  fields: 10, //非文件字段的数量
  fileSize: 500 * 1024, //文件大小 单位 b
  files: 1, //文件数量
};

const upload = multer({ storage, limits });

module.exports = upload;
