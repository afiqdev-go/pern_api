const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.courses = require("./courses.model.js")(sequelize, Sequelize);
db.episodes = require("./episodes.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);
db.transactions = require("./transactions.model.js")(sequelize, Sequelize);

db.courses.hasMany(db.episodes, 
    { 
        foreignKey: 'course_id',
        as: "episodes" });

db.episodes.belongsTo(db.courses, {
    foreignKey: "course_id",
    as: "course"
});

db.transactions.belongsTo(db.users, {
    foreignKey: "user_id",
    as: "user"
});

db.transactions.belongsTo(db.courses, {
    foreignKey: "course_id",
    as: "course"
});

db.users.hasMany(db.transactions, {
    foreignKey: "user_id",
    as: "transactions"
});

db.courses.hasMany(db.transactions, {
    foreignKey: "course_id",
    as: "transactions"
});

module.exports = db;