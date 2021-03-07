const APP = {
  PORT: 3030,
  URL: 'http://localhost:3000',
  STATIC_PATH: '/public'
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
  accessKey: "xxxx",
  secretKey: "xxxx",
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

const MUSIC_ACCOUNT = {
  phone: 'xxxx',
  password: 'xxxx',
  uid: 'xxxx'
};

module.exports = {
  APP,
  MONGODB,
  EMAIL,
  QINIU,
  TOKEN,
  REFRESH_TOKEN,
  MUSIC_ACCOUNT

};
