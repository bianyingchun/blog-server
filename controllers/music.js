const Music = require("../models/music");
const { upToQiniu, removeTemFile } = require("../util/upload");
const { lyric, likelist, login_cellphone, playlist_detail, login_status } = require('../plugins/music');
const { MUSIC_ACCOUNT } = require('../config');
let cookie = null;
// 添加音乐
const addMusic = async (obj) => {
  return await new Music(obj).save();
};

// 删除音乐
const deleteMusic = async (_id) => {
  return await Music.findByIdAndRemove(_id);
};

// 修改音乐数据
const editMusic = async (_id, opt) => {
  return await Music.findByIdAndUpdate(_id, opt);
};
const getMusic = async (_id) => Music.findById(_id);

// 获取所有音乐
const getMusicList = async (opts = {}) => {
  let { state = "", current_page = 1, page_size = 10 } = opts;
  // 查询参数
  const options = {
    page: Number(current_page),
    limit: Number(page_size),
  };

  const querys = {};
  // 审核状态查询
  console.log("审核状态", typeof state);
  if (["0", "1", "2"].includes(state)) {
    querys.state = Number(state);
  }

  const musics = await Music.paginate(querys, options);
  let result = {};
  if (musics) {
    result = {
      pagination: {
        total: musics.total,
        current_page: options.page,
        total_page: musics.pages,
        per_page: options.limit,
      },
      list: musics.docs,
    };
  }
  return result;
};

// 上传海报
const uploadPosterCDN = async (file) => {
  // 上传到七牛
  const { path, filename } = file;
  const qiniu = await upToQiniu(path, filename);
  // 上存到七牛之后 删除原来的缓存文件
  removeTemFile(path);
  return qiniu;
};

const getLikeList = async () => {
  const isLogined = await getLoginStatus();
  if (!isLogined) {
    try {
      await loginByPhone(MUSIC_ACCOUNT.phone, MUSIC_ACCOUNT.password);
    } catch (err) {
      console.log('登录失败', err);
    }
  }
  const result = await likelist({
    uid: MUSIC_ACCOUNT.uid,
    cookie
  });
  if (result.status === 200) {
    return result.body;
  }
  throw result.body;
};
const getLyric = async (id) => {
  const result = await lyric({
    id,
    cookie
  });
  if (result.status === 200) {
    return result.body;
  }
  throw result.body;
};

const getLoginStatus = async () => {
  const result = await login_status({
    cookie,
  });
  if (result.status === 200) {
    cookie = result.cookie;
  }
  return result.stauts === 200;
};

const loginByPhone = async (phone, password) => {
  const result = await login_cellphone({
    phone,
    password
  });

  if (result.status === 200) {
    cookie = result.body.cookie;
    return result.body;
  }
  throw result.body;
};

const getPlayList = async (id) => {
  const isLogined = await getLoginStatus();
  if (!isLogined) {
    try {
      await loginByPhone(MUSIC_ACCOUNT.phone, MUSIC_ACCOUNT.password);
    } catch (err) {
      console.log('登录失败', err);
    }
  }
  const result = await playlist_detail({
    id,
    cookie
  });
  if (result.status === 200) {
    return result.body;
  }
  throw result.body;
};


module.exports = {
  addMusic,
  deleteMusic,
  editMusic,
  getMusicList,
  getMusic,
  uploadPosterCDN,
  getLyric,
  getLikeList,
  loginByPhone,
  getPlayList,
  getLoginStatus
};
