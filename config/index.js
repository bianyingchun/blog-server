const APP = {
  PORT: 3030,
};

const MONGODB = {
  URI: "mongodb://localhost:27027/blogdb",
};
const EMAIL = {
  SERVICE: '163',
  ACCOUNT: 'bianyc7@163.com',
  PASSWORD: 'OEMPMEEHDHBDRDGF'// IMAP/SMTP授权码，需要从qq邮箱获取
};

const QINIU = {
  accessKey: 'your_qn_accessKey',
  secretKey: 'your_qn_secretKey',
  bucket: 'naice',
  origin: 'xxxxxx',
  uploadURL: 'your_qn_uploadURL'
};

module.exports = {
  APP,
  MONGODB,
  EMAIL,
  QINIU
};
