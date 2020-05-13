const Music = require("../models/music");
const { upToQiniu, removeTemFile } = require("../util/upload");

// 添加音乐
const addMusic = async (ctx, obj) => {
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

// 获取所有音乐
const getMusic = async (opts = {}) => {
  let { state = "", id = "", current_page = 1, page_size = 10 } = opts;
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
  if (id) {
    querys._id = id;
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

module.exports = {
  addMusic,
  deleteMusic,
  editMusic,
  getMusic,
  uploadPosterCDN,
};
