const APP = {
  PORT: 3030,
};

const MONGODB = {
  URI: "mongodb://localhost:27027/blogdb",
};
const EMAIL = {
  SERVICE: "163",
  ACCOUNT: "bianyc7@163.com",
  PASSWORD: "OEMPMEEHDHBDRDGF", // IMAP/SMTP授权码，需要从qq邮箱获取
};

const QINIU = {
  accessKey: "dQf57N3J2HuG3TR9MtbEu--MXYJRYLxXJjppVjxy",
  secretKey: "Xq77ZZXNCy6Be4efpsZ9XM2tLVXl7D5T-aPCrAVa",
  bucket: "bianyc",
  origin: "xxxxxx",
  uploadURL: "qa68vnk5w.bkt.clouddn.com",
};
const TOKEN = {
  screct: "token_jwtscrect",
  expiresIn: "15m",
};
const REFRESH_TOKEN = {
  screct: "refresh_token_jwtscrect",
  expiresIn: "7d",
};


module.exports = {
  APP,
  MONGODB,
  EMAIL,
  QINIU,
  TOKEN,
  REFRESH_TOKEN
};
