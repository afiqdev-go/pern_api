const db = require("../models");
const { where } = require("sequelize");
const User = db.users

checkDuplicateEmail  = async (req, res, next) => {
    try {
        let newUser = await User.findOne({
            where : {
                email : req.body.email,
            }
        })

        if (newUser) {
            res.status(400).send({
                message : "gagal! email sudah digunakan!"
            });
            return;
        }
        next();
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}


const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail
}

module.exports = verifySignUp;