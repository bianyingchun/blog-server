const Article = require('../models/article');

// 添加
const addArticle = async (info) => {
    let article = null;
    if (info) {
        article = await (new Article(info)).save();
    }
    return article;
};

// 修改
const editArticle = async (id, info) => {
    return await Article.findByIdAndUpdate(id, info);
};

//删除
const deleteArticle = async (id) => {
    return await Article.findByIdAndRemove(id);
};

//查找
const getArticleById = async (id) => {
    let res = await Article.findById(id).populate('tag');
    if (res) {
        res.meta.views += 1;
        res = await res.save();
    }
    return res;
};
// 根据文章id更新文章状态
const changeArticleStatus = async (_id, opts) => {
    const { state, publish } = opts;

    const querys = {};

    if (state) querys.state = state;

    if (publish) querys.publish = publish;

    return await Article.findByIdAndUpdate(_id, querys);
};

// 喜欢文章
const likeArticle = async (_id) => {
    let res = await Article.findById(_id);
    if (res) {
        // 每次请求，views 都增加一次
        res.meta.likes += 1;
        res = await res.save();
    }
    return res;
};

//分页获取
const getArtiles = async (opts) => {

};
module.exports = {
    addArticle,
    editArticle,
    deleteArticle,
    getArticleById,
    getArtiles
};