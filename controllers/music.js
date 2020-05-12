const Music = require('../models/music');
const { upToQiniu, removeTemFile } = require('../util/upload');

// 添加音乐
const addMusic = async (ctx, obj) => {
    return await (new Music(obj)).save();
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
    let { state = '', id = '' } = opts;
    // 查询参数
    const querys = {};
    // 审核状态查询
    if (['0', '1', '2'].includes(state)) {
        querys.state = Number(state);
    }
    if (id) {
        querys._id = id;
    }
    return await Music.find(querys);
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
    uploadPosterCDN
};
