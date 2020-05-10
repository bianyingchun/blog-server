const Project = require('../models/project');

const addProject = async (opts) => {
    return await (new Project(opts)).save();
};

const deleteProject = async (id) => {
    return Project.findByIdAndRemove(id);
};

const editProject = async (id, opts) => {
    return await Project.findByIdAndUpdate(opts);
};
const getProjectById = async (id) => {
    return await Project.findById(id);
};

const getProjects = async (opts) => {
    const { current_page = 1, page_size = 1 } = opts;
    const options = {
        sort: { create_at: -1 },
        page: Number(current_page),
        limit: Number(page_size)
    };
    const querys = {};
    // 查询
    const result = await Project.paginate(querys, options);
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
    } else {
        return false;
    }
};

module.exports = {
    addProject,
    deleteProject,
    editProject,
    getProjectById,
    getProjects
};