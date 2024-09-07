const transactionService = require("../controllers/transaction.service");
const midtransConfig = require("../config/midtrans.config");
const { nanoid } = require("nanoid");
const db = require("../models");
const User = db.users;
const Course = db.courses;
const crypto = require("crypto");

const Op = db.Sequelize.Op;

exports.createTransaction = async (req, res) => {
  try {
    const { user_id, course_id, amount, transaction_date, payment_status } =
      req.body;
    const transaction_id = `TRX-${nanoid(4)}-${nanoid(8)}`;
    const authString = btoa(`${midtransConfig.midtrans_server_key}:`);
    const userData = await User.findByPk(user_id);
    const courseData = await Course.findByPk(course_id);
    const payload = {
      transaction_details: {
        order_id: transaction_id,
        gross_amount: amount,
      },
      customer_details: {
        first_name: userData.name,
        email: userData.email,
      },
      item_details: [
        {
          id: courseData.id,
          price: courseData.price,
          quantity: 1,
          name: courseData.title,
        },
      ],
      callbacks: {
        finish: `${midtransConfig.frontend_url}/transaction/${transaction_id}/finish`,
        error: `${midtransConfig.frontend_url}/transaction/${transaction_id}/error`,
        pending: `${midtransConfig.frontend_url}/transaction/${transaction_id}/pending`,
      },
    };

    const response = await fetch(
      `${midtransConfig.midtrans_app_url}/snap/v1/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (response.status !== 201) {
      return res
        .status(response.status)
        .json({ message: data.error_messages[0] });
    }
    const responseData = await Promise.all([
      transactionService.createTransaction({
        user_id,
        course_id,
        order_id: transaction_id,
        amount,
        transaction_date,
        payment_status,
        snap_token: data.token,
        snap_redirect_url: data.redirect_url,
      }),
    ]);

    if (responseData[0].message !== "transaction baru telah terdaftar") {
      return res.status(500).json({ message: responseData[0].message });
    }
    return res.json({
      message: "Transaksi berhasil dibuat",
      data: {
        transaction_id: transaction_id,
        snap_token: data.token,
        snap_redirect_url: data.redirect_url,
        status: "pending",
      },
    });
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const data = await transactionService.getTransactions();
    const response = {
      message: "success",
      data: data,
    };
    res.send(response);
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};

const updateStatusBasedOnMidtransResponse = async (transaction_id, data) => {
  const hash = crypto
    .createHash("sha512")
    .update(
      `${transaction_id}${data.status_code}${data.gross_amount}${midtransConfig.midtrans_server_key}`
    )
    .digest("hex");

  if (data.signature_key !== hash) {
    return {
      status: "error",
      message: "Unauthenticated",
    };
  }

  let responseData = null;
  let transactionStatus = data.transaction_status;
  let fraud_status = data.fraud_status;

  if (transactionStatus == "capture") {
    if (fraud_status == "accept") {
      const transaction = await transactionService.updateTransactionStatus({
        transaction_id,
        status: "PAID",
        payment_method: data.payment_type,
      });
      responseData = transaction;
    }
  } else if (transactionStatus == "settlement") {
    const transaction = await transactionService.updateTransactionStatus({
      transaction_id,
      status: "PAID",
      payment_method: data.payment_type,
    });
    responseData = transaction;
  } else if (
    transactionStatus == "cancel" ||
    transactionStatus == "deny" ||
    transactionStatus == "expire"
  ) {
    const transaction = await transactionService.updateTransactionStatus({
      transaction_id,
      status: "CANCELLED",
    });
    responseData = transaction;
  } else if (transactionStatus == "pending") {
    const transaction = await transactionService.updateTransactionStatus({
      transaction_id,
      status: "PENDING",
    });
    responseData = transaction;
  }
  return {
    status: "success",
    data: responseData,
  };
};

exports.trxNotification = async (req, res) => {
  const data = req.body;

  transactionService
    .getTransactionById({ id: data.order_id })
    .then((transaction) => {
      if (transaction) {
        updateStatusBasedOnMidtransResponse(transaction.order_id, data).then(
          (result) => {
            console.log("result:", result);
          }
        );
      }
    });

  res.status(200).json({
    status: "success",
    message: "OK",
  });
};

// fungsi ini untuk mengecek apakah user sudah membayar atau belum
/*
  Algoritma:
  1. ambil semua data berdasarkan user_id dan course_id
  2. jika ditemukan cek apakah pada salah satu data terdapat status PAID
  3. jika ditemukan maka kembalikan response bahwa user sudah membayar

*/
exports.checkStatus = async (req, res) => {
  const user_id = req.query.user_id;
  const course_id = req.query.course_id;

  try {
    const data = await transactionService.getTransactionByUserIdAndCourseId({
      user_id,
      course_id,
    });
    console.log("mydata", data)
    if (data) {
      if (data.payment_status === "PAID") {
        res.status(200).json({
          status: "success",
          message: "PAID",
        });
      }
    } else {
      res.status(200).json({
        status: "success",
        message: "UNPAID",
      });
    }
  } catch (error) {
    res.status(500).send({ message: `error -> ${error}` });
  }
};
