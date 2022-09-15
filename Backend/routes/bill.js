const express = require("express");
const connection = require("../connection");
const auth = require("../services/auth");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
var moment = require('moment');
const router = express.Router();

router.post("/generateReport", auth.authenticate, (req, res) => {
  const billDetails = req.body;
  billDetails.date=moment(billDetails.date).format("YYYY-MM-DD")
  let transactionsDetailsReport = JSON.parse(billDetails.transactionsDetails);
  transactionsDetailsReport.date=moment(transactionsDetailsReport.date).format("YYYY-MM-DD");
  let query =
    "insert into bill (date,solde, transactionsDetails) values(?,?,?) ON DUPLICATE KEY UPDATE transactionsDetails=?";

  connection.query(
    query,
    [
      billDetails.date,
      billDetails.solde,
      billDetails.transactionsDetails,
      billDetails.transactionsDetails
    ],
    (err, results) => {
      if (!err) {
        
        ejs.renderFile(
          path.join(__dirname, "", "report.ejs"),
          {
            transactionsDetails: transactionsDetailsReport,
            date: billDetails.date,
            solde:billDetails.solde
          },
          (err, results) => {
            if (err) {
              return res.status(500).json({ err});
            } else {
               pdf.create(results)
                .toFile(
                  "../generated_PDF/" + billDetails.date + ".pdf",
                  (err, data) => {
                    if (err) {
                      return res.status(500).json({ err });
                    } else {
                      return res.status(200).json({ date:billDetails.date });
                    }
                  }
                );
              
            }
          }
        );
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});

router.post("/getPDF", auth.authenticate, (req, res) => {
  const transactionsDetails = req.body;
  transactionsDetails.date=moment(transactionsDetails.date).format("YYYY-MM-DD")
  const pdfPath = "../generated_PDF/" + transactionsDetails.date + ".pdf";
  if (fs.existsSync(pdfPath)) {
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } else {
    
    let transactionsDetailsReport = JSON.parse(transactionsDetails.transactionsDetails);
    ejs.renderFile(
      path.join(__dirname, "", "report.ejs"),
      {
        transactionsDetails: transactionsDetailsReport,
        date:transactionsDetails.date
      },
      (err, results) => {
        if (err) {
          return res.status(500).json({ err });
        } else {
          pdf.create(results)
                .toFile(
                  "../generated_PDF/" + transactionsDetails.date + ".pdf",
                  (err, data) => {
                    if (err) {
                  return res.status(500).json({ err });
                } else {
                     res.contentType("application/pdf");
                    fs.createReadStream(pdfPath).pipe(res);
                  return res.status(200).json({ date:transactionsDetails.date });
                }
              }
            );
        }
      }
    );
  }
});

router.get("/getBills", auth.authenticate, (req, res, next) => {
  let query = "select * from bill order by date ASC";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.post("/get/date", (req, res, next) => {
  let date = req.body;
  let query =
   "SELECT * FROM bill AS t where date=? ORDER BY date ASC ;";
  connection.query(query, [date.date], (err, results) => {
    if (!err) {
      return res.status(200).json(results );
    } else {
      return res.status(500).json({ err });
    }
  });
});


router.delete("/delete/:id", auth.authenticate, (req, res, next) => {
  const id = req.params.id;
  let query = "delete from bill where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Bill ID not found" });
      }
      return res.status(200).json({ message: "Bill deleted successfully" });
    } else {
      return res.status(500).json({ err });
    }
  });
});

module.exports = router;
