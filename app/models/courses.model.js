module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("course", {
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      mentor: {
        type: Sequelize.STRING
      }
    });
  
    return Course;
}