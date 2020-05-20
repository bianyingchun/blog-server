const Article = require("../models/article");
const Comment = require("../models/comment");
const util = require("../util");

const addComment = async (ctx, comment) => {
  const ipInfo = util.parseIp(ctx.request);
  comment = Object.assign(comment, ipInfo);
  comment.agent = ctx.header["user-agent"] || comment.agent;
  const article = await Article.findByIdAndUpdate(comment.post_id, {
    $inc: { "meta.comments": 1 },
  }, { new: true });
  comment.post_title = article.title;
  return await new Comment(comment).save();
};

const deleteComment = async (id) => {
  const comment = Comment.findById(id);
  await Article.findByIdAndUpdate(comment.post_id, {
    $inc: { "meta.comments": -1 },
  });
  return await comment.remove();
};

const editComment = async (id, opt) => {
  return await Comment.findByIdAndUpdate(id, opt, { new: true });
};

const likeComment = async (id) => {
  return await Comment.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  );
};

const getComment = async (opts = {}) => {
  let {
    sort = -1,
    current_page = 1,
    page_size = 10,
    keyword = "",
    post_id,
    state,
  } = opts;
  let result = {};
  const options = {
    page: Number(current_page),
    limit: Number(page_size),
  };
  sort = Number(sort);
  if ([1, -1].includes(sort)) {
    options.sort = { _id: sort };
  } else if (sort === 2) {
    //热度排序
    options.sort = { likes: -1 };
  }
  const querys = {};
  if (state && ["0", "1", "2"].includes(state)) {
    querys.state = Number(state);
  }
  if (keyword) {
    const keywordReg = new RegExp(keyword, "i");
    querys["$or"] = [
      { content: keywordReg },
      { "author.name": keywordReg },
      { "author.email": keywordReg },
    ];
  }
  if (post_id !== undefined) {
    querys.post_id = post_id;
  }
  const comments = await Comment.paginate(querys, options);

  if (comments) {
    result = {
      pagination: {
        total: comments.total,
        current_page: options.page,
        total_page: comments.pages,
        per_page: options.limit,
      },
      list: comments.docs,
    };
  }
  return result;
};
module.exports = {
  addComment,
  editComment,
  deleteComment,
  likeComment,
  getComment,
};
