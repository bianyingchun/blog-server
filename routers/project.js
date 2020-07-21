const Router = require("koa-router");
const router = new Router();
const { resSuccess } = require("../util/resHandle");
const verifyParmas = require("../middlewares/verify-params");
const {
    addProject,
    deleteProject,
    getProjectById,
    getProjects,
    editProject,
} = require("../controllers/project");

router.post(
    "/add",
    verifyParmas(["title", "desc", "github", "tags"]),
    async (ctx, next) => {
        try {
            await addProject(ctx.request.body);
            resSuccess({ ctx, message: "添加项目成功" });
        } catch (error) {
            error.message = "添加项目失败";
            throw error;
        }
    }
);

router.post("/delete", async (ctx, next) => {
    const { id } = ctx.request.body;
    if (!id) {
        return ctx.throw(500, "参数id缺失");
    }
    try {
        await deleteProject(id);
        resSuccess({ ctx, message: "删除项目成功" });
    } catch (error) {
        error.message = "项目删除失败";
        throw error;
    }
});



router.post("/edit", async (ctx, next) => {
    const { id, info } = ctx.request.body;
    if (!id) {
        return ctx.throw(500, "参数id 缺失");
    }
    try {
        await editProject(id, info);
        resSuccess({ ctx, message: "修改项目成功" });
    } catch (error) {
        error.message = "修改项目失败";
        throw error;
    }
});

router.get("/detail", async (ctx, next) => {
    try {
        const res = await getProjectById(ctx.query.id);
        resSuccess({ ctx, message: "获取项目成功", result: res });
    } catch (err) {
        err.message = "获取项目失败";
        throw err;
    }
});
router.get('/list', async (ctx) => {
    try {
        const res = await getProjects(ctx.query);
        resSuccess({ ctx, message: "获取项目成功", result: res });
    } catch (err) {
        err.message = "获取项目失败";
        throw err;
    }
});
module.exports = router;
