module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
      user_id: {
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.STRING
      },
      course_id: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      transaction_date: {
        type: Sequelize.DATE
      },
      payment_status: {
        type: Sequelize.STRING
      },
      snap_token: {
        type: Sequelize.STRING
      },
      snap_redirect_url: {
        type: Sequelize.STRING
      },
      payment_method: {
        type: Sequelize.STRING
      },
    });
  
    return Transaction;
}