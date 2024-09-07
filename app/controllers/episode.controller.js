const db = require("../models");
const Episode = db.episodes;
const Op = db.Sequelize.Op;

exports.getEpisodesByCourseId = async (req, res) => {
  try {
    const course_id = req.query.course_id;
    const episodes = await Episode.findAll({ where: { course_id: course_id } });
    if (!episodes) {
      res.status(200).send({ message: "success", data: [], total: 0 });
    } else {
      res.send({ message: "success", data: episodes, total: episodes.length });
    }
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.getEpisodeById = async (req, res) => {
  try {
    const id = req.params.id;
    const episode = await Episode.findByPk(id);
    if (!episode) {
      res.status(404).send({ message: "episode not found" });
    }
    res.send({ message: "success", data: episode });
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.createEpisode = async (req, res) => {
  try {
    const episode = {
      title: req.body.title,
      link: req.body.link,
      status: req.body.status,
      course_id: req.body.course_id,
    };

    const newEpisode = await Episode.create(episode);
    if (newEpisode) {
      res.send({ message: "episode baru telah terdaftar" });
    }
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.updateEpisode = async (req, res) => {
  try {
    const id = req.params.id;
    const getEpisode = await Episode.findByPk(id);
    if (!getEpisode) {
      res.status(404).send({ message: "episode not found" });
    }

    const episode = {
      title: req.body.title,
      link: req.body.link,
      status: req.body.status,
      course_id: req.body.course_id,
    };

    const updatedEpisode = await Episode.update(episode, {
      where: { id: id },
    });
    if (updatedEpisode) {
      res.send({ message: "episode telah diupdate" });
    }
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.deleteEpisode = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedEpisode = await Episode.destroy({
      where: { id: id },
    });
    if (deletedEpisode) {
      res.send({ message: "episode telah dihapus" });
    }
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};
