const Tag = require("../models/tag");
const Classify = require("../models/classify");

const addTag = (info) => new Tag(info).save();
const editTag = (id, info) => Tag.findByIdAndUpdate(id, info, { new: true });

const findTag = (query) => Tag.findOne(query);

// 该标签下的graph
const getContent = async (id, opts = {}) => {
  const { page = 1, limit = 10 } = opts;
  const match = {};
  if (opts.publish !== undefined) {
    match.publish = Number(opts.publish);
  }
  const options = {
    page: Number(page),
    limit: Number(limit),
    populate: {
      path: "item",
      match: match,
    },
    select: "item",
    sort: { et: -1 },
  };

  const result = await Classify.paginate({ tag: id }, options);
  return {
    list: result.docs.map((doc) => doc.item),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
};

// 标签列表
const getList = async (parent = null, opts = {}) => {
  const { page = 1, limit = 10 } = opts;
  const options = {
    page: Number(page),
    limit: Number(limit),
    sort: { et: -1 },
  };
  const result = await Tag.paginate({ parent }, options);
  return {
    list: result.docs,
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
};

const deleteTag = async (id) => {
  let ps = [
    Tag.findByIdAndDelete(id),
    Classify.deleteMany({ tag: id }),
    Tag.find({ parent: id }),
  ];
  let result = await Promise.all(ps);
  const children = result[2];
  if (children.length) {
    ps = children.map((item) => deleteTag(item._id));
    result = await Promise.all(ps);
  }
  return result;
};

const getRootTags = () => Tag.find({ parent: null });
// 清空标签
const clearTags = async () => {
  return await Promise.all([Tag.deleteMany(), Classify.deleteMany()]);
};

const findTagById = (id) => Tag.findById(id);

module.exports = {
  addTag,
  editTag,
  getContent,
  getList,
  deleteTag,
  findTag,
  clearTags,
  getRootTags,
  findTagById,
};
