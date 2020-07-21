const Folder = require("../models/folder");
const Fav = require("../models/fav");
// 创建收藏夹
const addFolder = (info) => new Folder(info).save();

const findFolder = (info) => Folder.findOne(info);

// 删除收藏夹
// 递归删除子文件夹
// todo 更新相关graph.meta
const deleteFolder = async (id) => {
  let ps = [
    Folder.findByIdAndDelete(id, { new: true }),
    Fav.deleteMany({ folder: id }),
    Folder.find({ parent: id }),
  ];
  let result = await Promise.all(ps);
  const children = result[2];
  if (children.length) {
    ps = children.map((item) => deleteFolder(item._id));
    result = await Promise.all(ps);
  }
  return result;
};

// 更新, todo 检测重名
const editFolder = (id, info) =>
  Folder.findByIdAndUpdate(id, info, { new: true });

const getChildren = async (parent) => {
  if (!parent) {
    parent = null;
  }
  const list = await Folder.find({ parent });
  return list;
};

const getList = async (folder) => {
  if (!folder) {
    folder = null;
  }
  return await Fav.find({ folder }).populate("to");
};

const findFolderById = async (id) => {
  if (!id) {
    return { name: "默认", desc: "" };
  }
  return await Folder.findById(id).lean();
};

module.exports = {
  addFolder,
  deleteFolder,
  editFolder,
  getChildren,
  getList,
  findFolder,
  findFolderById,
};

// todo 限制子文件夹个数，最多10个
// note parent=null/undefined 则表示为root 文件夹
// "5ed45e6f9409223af4fb351f" f1
// "5ed466fb230cee2bbc617fa7" f3
