const express = require("express");
const router = express.Router();
const {
  getRecommendGraph,
  countGraph,
  getTopGraph,
} = require("../controller/graph");
const {
  getRecommendAlbum,
  countAlbum,
  getTopAlbum,
} = require("../controller/album");
const { resError, resSuccess } = require("../util/resHandler");

const homeConfig = require("../config/setting.json").top.home;
router.get("/recommend", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = Number(page);
  limit = Number(limit);
  try {
    let ps = [
      countGraph({}, homeConfig.graph),
      countAlbum({}, homeConfig.album),
    ];
    const countArr = await Promise.all(ps);
    const total = countArr[0] + countArr[1];
    const rate = countArr[0] / total;
    const graphLimit = Math.floor(limit * rate);
    const albumLimit = limit - graphLimit;
    let resultArr = [];
    let graphList = [],
      albumList = [];
    ps = [
      getRecommendGraph(homeConfig.graph, { page, limit: graphLimit }),
      getRecommendAlbum(homeConfig.album, { page, limit: albumLimit }),
    ];
    if (page === 1) {
      ps = ps.concat([
        getTopGraph(homeConfig.graph),
        getTopAlbum(homeConfig.album),
      ]);
    }
    resultArr = await Promise.all(ps);
    graphList = resultArr[0].list;
    albumList = resultArr[1].list;
    let list = graphList
      .concat(albumList)
      .sort(() => (Math.random > 0.5 ? -1 : 1));
    if (page === 1) {
      let topList = resultArr[2]
        .concat(resultArr[3])
        .sort(() => (Math.random > 0.5 ? -1 : 1));
      list = topList.concat(list);
    }
    let info = {
      total: total,
      page: page,
      limit,
      list,
    };
    resSuccess(res, info);
  } catch (err) {
    console.log(err);
    resError(res, err);
  }
});


module.exports = router;
