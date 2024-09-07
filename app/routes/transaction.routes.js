const controller = require("../controllers/transaction.controller");
const { authJwt } = require("../middleware");
module.exports = function (app) {

    
    app.use(function (req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.post(
        "/api/transactions",
        [authJwt.verifyToken],
        controller.createTransaction
    );

    app.get(
        "/api/transactions",
        [authJwt.verifyToken],
        controller.getTransactions
    );

    app.post(
        "/api/transactions/notification",
        controller.trxNotification
    )

    app.get(
        "/api/transactions/check-status",
        controller.checkStatus
    )
}
