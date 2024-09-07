const db = require("../models");
const User = db.users;

const Op = db.Sequelize.Op;

function getPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
}

function getPagingData(data, page, limit) {
    const { count: totalItems, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, users, totalPages, currentPage };

}

exports.getUsers = async (req, res) => {
    try {
        // default page = 1, size = 10
        const { page, size, name } = req.query;
        var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
        const { limit, offset } = getPagination(page, size);

        const data = await User.findAndCountAll({ where: condition, limit, offset });
        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (error) {
        res.status(500).send({ message: `error1 -> ${error}` });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (!user) {
            res.status(404).send({ message: "user not found" });
        }
        res.send({"message": "success", "data": user});
    } catch (error) {
        res.status(500).send({ message: `error2 -> ${error}` });
    }
}

exports.getUsersCount = async (req, res) => {
    try {
        const count = await db.users.count()
        console.log(count);
        res.send({ "total_users": count });
    } catch (error) {
        res.status(500).send({ message: `errorw -> ${error}` });
    }
}