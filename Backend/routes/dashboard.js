const express = require("express");
const connection = require("../connection");
const auth = require("../services/auth");
const role = require("../services/checkRole");

const router = express.Router();

router.get("/details", auth.authenticate, (req, res, next) => {
  let userCount;
  let transactionCount;
  let billCount;

  let queryTransaction = "select count(id) as transactionCount from transaction";
  connection.query(queryTransaction, (err, results) => {
    if (!err) {
      transactionCount = results[0].transactionCount;
    } else {
      return res.status(500).json({ err });
    }
  });

  let queryUser = "select count(id) as userCount from user";
  connection.query(queryUser, (err, results) => {
    if (!err) {
      userCount = results[0].userCount;
    } else {
      return res.status(500).json({ err });
    }
  });

  let queryBill = "select count(id) as billCount from bill";
  connection.query(queryBill, (err, results) => {
    if (!err) {
      billCount = results[0].billCount;
      let data = {
        user: userCount,
        transaction: transactionCount,
        bill: billCount,
      };
      return res.status(200).json({ data });
    } else {
      return res.status(500).json({ err });
    }
  });

  
});


module.exports = router;
