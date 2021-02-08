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
    let res = await Article.findById(id).populate('tags');
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
const getArtilesByPage = async (opts) => {
    let {
        current_page = 1,
        page_size = 10,
        keywords = '',
        state = 1,
        publish = 1, tag, type = -1, date, hot } = opts;
    const options = {
        sort: { create_at: -1 },
        page: Number(current_page),
        limit: Number(page_size),
        populate: ['tags'],
        select: {
            'content': 0,
            'editContent': 0
        }
    };
    const querys = {};
    if (keywords) {
        const keywordsReg = new RegExp(keywords, 'i');
        querys['$or'] = [
            { 'title': keywordsReg },
            { 'content': keywordsReg },
            { 'desc': keywordsReg }
        ];
    }
    // 按照state查询
    state = Number(state);
    publish = Number(publish);
    type = Number(type);
    if ([1, 2].includes(state)) {
        querys.state = state;
    }

    // 按照公开程度查询
    if ([1, 2].includes(publish)) {
        querys.publish = publish;
    }

    // 按照类型程度查询
    if ([1, 2, 3].includes(type)) {
        querys.type = type;
    }

    // 按热度排行
    if (hot) {
        options.sort = {
            'meta.views': -1,
            'meta.likes': -1,
            'meta.comments': -1
        };
    }
    // 时间查询
    if (date) {
        const getDate = new Date(date);
        if (!Object.is(getDate.toString(), 'Invalid Date')) {
            querys.create_at = {
                "$gte": new Date((getDate / 1000 - 60 * 60 * 8) * 1000),
                "$lt": new Date((getDate / 1000 + 60 * 60 * 16) * 1000)
            };
        }
    }
    if (tag) {
        querys.tags = { $all: [tag] };
    }
    const result = await Article.paginate(querys, options);
    if (result) {
        return {
            pagination: {
                total: result.total,
                current_page: result.page,
                total_page: result.pages,
                page_size: result.limit
            },
            list: result.docs
        };
    }
    return false;

};

const getArticlesByGroup = async () => {
    const articles = await Article.aggregate([
        { $match: { state: 1, publish: 1 } },
        {
            $project: {
                year: { $year: '$create_at' },
                month: { $month: '$create_at' },
                title: 1,
                create_at: 1,
                thumb: 1,
                desc: 1,
                meta: 1,
                type: 1
            }
        },
        {
            $group: {
                _id: {
                    year: '$year',
                    month: '$month'
                },
                article: {
                    $push: {
                        title: '$title',
                        _id: '$_id',
                        create_at: '$create_at',
                        thumb: '$thumb',
                        desc: '$desc',
                        meta: '$meta',
                        type: '$type'
                    }
                }
            }
        }
    ]);
    if (articles) {
        let yearList = [...new Set(articles.map(item => item._id.year))].map(item => {
            let monthList = [];
            articles.forEach(n => {
                // 同一年
                if (n._id.year === item) {
                    monthList.push({ month: n._id.month, articleList: n.article.reverse() });
                }
            });
            return { year: item, monthList };
        });
        return yearList;
    }
    else {
        return [];
    }
};
module.exports = {
    addArticle,
    editArticle,
    deleteArticle,
    likeArticle,
    getArticleById,
    getArtilesByPage,
    changeArticleStatus,
    getArticlesByGroup
};