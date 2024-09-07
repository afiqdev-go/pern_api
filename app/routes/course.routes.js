const controller = require("../controllers/course.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/courses", controller.getCourses);
  app.get("/api/courses/:id", controller.getCourseById);
  app.post(
    "/api/courses",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createCourse
  );
  app.put(
    "/api/courses/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateCourse
  );
  app.delete(
    "/api/courses/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteCourse
  );
};
