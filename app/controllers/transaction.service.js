const { Transaction } = require("sequelize");
const db = require("../models");

class TransactionService {
  async createTransaction({
    user_id,
    course_id,
    order_id,
    amount,
    transaction_date,
    payment_status,
    snap_token,
    snap_redirect_url,
  }) {
    try {
      const transaction = {
        user_id,
        course_id,
        order_id,
        amount,
        transaction_date,
        payment_status,
        snap_token,
        snap_redirect_url,
      };
      const newTransaction = await db.transactions.create(transaction);
      if (newTransaction) {
        console.log("transaction baru telah terdaftar");
        return { message: "transaction baru telah terdaftar" };
      } else {
        console.log("error -> transaction gagal terdaftar");
        return { message: "error -> transaction gagal terdaftar" };
      }
    } catch (error) {
      return { message: `error -> ${error}` };
    }
  }

  async getTransactions() {
    try {
      const data = await db.transactions.findAll({
        include: [
          {
            model: db.users,
            as: 'user',
            attributes: ['name']
          },
          {
            model: db.courses,
            as: 'course',
            attributes: ['title']
          }
        ]
      });
      return data;
    } catch (error) {
      return { message: `error -> ${error}` };
    }
  }

  async getTransactionById({id}) {
    try {
      const data = await db.transactions.findOne({
        where: {
          order_id: id
        },
        include: [
          {
            model: db.users,
            as: 'user',
            attributes: ['name']
          },
          {
            model: db.courses,
            as: 'course',
            attributes: ['title']
          }
        ]
      });
      return data;
    } catch (error) {
      return { message: `error -> ${error}` };
    }
  }

  async updateTransactionStatus({transaction_id, status, payment_method=null}) {
    try {
      const transaction = await db.transactions.update(
        { payment_status: status, payment_method: payment_method },
        { where: { order_id: transaction_id } }
      );
      return transaction;
    } catch (error) {
      return { message: `error -> ${error}` };
    }
  }

  async getTransactionByUserIdAndCourseId({user_id, course_id}) {
    try {
      const data = await db.transactions.findOne({
        where: {
          user_id: user_id,
          course_id: course_id,
          payment_status: 'PAID'
        }
      });
      return data;
    } catch (error) {
      return { message: `error -> ${error}` };
    }
  }
}

const transactionService = new TransactionService();
module.exports = transactionService;

