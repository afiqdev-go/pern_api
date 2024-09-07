const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;

const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role ? req.body.role : "user",
    };

    const newUser = await User.create(user);
    if (newUser) {
      const token = jwt.sign({ id: newUser.id }, config.secret, {
        expiresIn: 86400,
      });

      res.send(
        { 
          message: "user baru telah terdaftar",
          data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            accessToken: token,
          }
        });
    }
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "user tidak ditemukan" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "password salah",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).send({ message: "berhasil logout" });
  } catch (error) {
    this.next(error);
  }
};
