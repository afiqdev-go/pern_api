const controller = require("../controllers/episode.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/episode-courses", controller.getEpisodesByCourseId)
  // app.get("/api/episodes", controller.getEpisodes);
  app.get("/api/episodes/:id", controller.getEpisodeById);
  app.post(
    "/api/episodes",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createEpisode
  );
  app.put(
    "/api/episodes/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateEpisode
  );
  app.delete(
    "/api/episodes/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteEpisode
  );
};
