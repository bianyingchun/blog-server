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

module.exports = {
  APP,
  MONGODB,
  EMAIL
};
