const Tag = require('../models/tag');
const Article = require('../models/article');

const addTag = async (opt) => {
    const name = opt.name;
    const res = await Tag.find({ name });
    if (res && res.length) {
        throw new Error('标签已存在');
    } else {
        const tag = await (new Tag(opt)).save();
        return tag;
    }
};

const getTags = async (query = {}) => {
    const { current_page = 1, page_size = 50, keyword = '' } = query;
    const options = {
        page: Number(current_page),
        limit: Number(page_size),
    };
    let querys = {};
    if (keyword) {
        querys.name = new RegExp(keyword, 'i');
    }
    let result = {};
    const res = await Tag.paginate(querys, options);
    if (res) {
        let $match = {};
        // 前台请求时，只有已经发布的和公开
        // if(!authIsVerified(ctx.request)) $match = { state: 1, publish: 1 }
        const article = await Article.aggregate([
            { $match },
            { $unwind: '$tag' },
            {
                $group: {
                    _id: '$tag',
                    num_tutorial: { $sum: 1 }
                }
            }
        ]);
        if (article) {
            res.docs.forEach(t => {
                const finded = article.find(c => String(c.__id) === String(t._id));
                t.count = finded ? finded.num_tutorial : 0;
            });
            result = {
                pagination: {
                    total: res.total,
                    current_page: res.page,
                    total_page: res.pages,
                    page_size: res.limit
                },
                list: res.docs
            };
        }
    }
    return result;
};

const editTag = async (opt) => {
    const { id, name, desc } = opt;
    return await Tag.findByIdAndUpdate(id, { name, desc }, { new: true });
};

const deleteTag = async (_id) => {
    return await Tag.findByIdAndRemove(_id);
};

module.exports = {
    addTag,
    getTags,
    editTag,
    deleteTag
};