const db = require("../models");
const Course = db.courses;
const Op = db.Sequelize.Op;

// function getPagination(page, size) {
//   const limit = size ? +size : 10;
//   const offset = page ? page * limit : 0;

//   return { limit, offset };
// }

// function getPagingData(data, page, limit) {
//   const { count: totalItems, rows: courses } = data;
//   const currentPage = page ? +page : 0;
//   const totalPages = Math.ceil(totalItems / limit);

//   return { totalItems, courses, totalPages, currentPage };
// }

exports.getCourses = async (req, res) => {
  try {
    const data  = await Course.findAll();
    const response = {
      message: "success",
      data: data,
    }
    res.send(response);
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.findByPk(id);
    if (!course) {
      res.status(404).send({ message: "course not found" });
    }
    res.send({ message: "success", data: course });
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const course = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      mentor: req.body.mentor,
      image : req.body.image
    };

    const newCourse = await Course.create(course);
    if (newCourse) {
      res.send({ message: "course baru telah terdaftar" });
    }
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};


exports.updateCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const getCourse = await Course.findByPk(id);
    if (!getCourse) {
      res.status(404).send({ message: "course not found" });
    }

    const course = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      mentor: req.body.mentor,
      image : req.body.image,
    };

    const updatedCourse = await Course.update(course, {
      where: { id: id },
    });
    if (updatedCourse) {
      res.send({ message: "course telah diupdate" });
    }
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const getCourse = await Course.findByPk(id);
    if (!getCourse) {
      res.status(404).send({ message: "course not found" });
    }

    const deletedCourse = await Course.destroy({
      where: { id: id },
    });
    if (deletedCourse) {
      res.send({ message: "course telah dihapus" });
    }
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};
