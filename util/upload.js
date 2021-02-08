const multer = require("koa-multer");
const path = require("path");
const qiniu = require('qiniu');
const myConfig = require('../config');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.mimetype.split('/')[0];
    const tempDir = path.join(__dirname, "../public", type);
    mkdirsSync(tempDir);
    cb(null, tempDir);
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
  // fileSize: 500 * 1024, //文件大小 单位 b
  files: 1, //文件数量
};
// 上传到本地
const upload = multer({ storage, limits });

// 上传到七牛

const upToQiniu = (filePath, key) => {
  const accessKey = myConfig.QINIU.accessKey;
  const secretKey = myConfig.QINIU.secretKey;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: myConfig.QINIU.bucket
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  const config = new qiniu.conf.Config();
  // 空间对应的机房
  config.zone = qiniu.zone.Zone_z2;
  const localFile = filePath;
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  // 文件上传
  return new Promise((resolved, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        reject(respErr);
      } else {
        resolved(respBody);
      }
    });
  });
};

// 删除文件
const removeTemFile = (filePath) => {
  fs.unlinkSync(filePath);
};

const mkdirsSync = directory => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
};

module.exports = {
  upload,
  upToQiniu,
  removeTemFile
};
