
module.exports = (sequelize, Sequelize) => {
    const Episode = sequelize.define("episode", {
      title: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      course_id: {
        type: Sequelize.INTEGER
      }
    });
  
    return Episode;
}