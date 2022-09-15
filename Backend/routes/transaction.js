const express = require("express");
const connection = require("../connection");
 const auth = require("../services/auth");
const role = require("../services/checkRole");
const csv = require('fast-csv');
const multer = require('multer');
const bodyparser = require('body-parser')
const path = require('path')
const fs = require('fs');

const router = express.Router();

router.post("/add", auth.authenticate,  (req, res) => {
  let transaction = req.body;
  let query =
    'insert into transaction (libelle, date_transaction, recette, depense,userID) values(?,?,?,?,?)';

  connection.query(
    query,
    [transaction.libelle, transaction.date_transaction, transaction.recette, transaction.depense,transaction.userid],
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "transaction added successfully" });
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});

router.get("/get", auth.authenticate, (req, res) => {
  let query =
    "SELECT *,  (SELECT SUM(recette-depense) FROM transaction WHERE date_transaction <= t.date_transaction  and id<=t.id) AS solde FROM transaction AS t  ORDER BY date_transaction ASC;";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.get("/get/user/:id", auth.authenticate, (req, res) => {
  const id = req.params.id;
  let query =
    "SELECT libelle,date_transaction,recette,depense,u.name as userName FROM transaction INNER JOIN user as u where userID=u.id=? ORDER BY date_transaction ASC;";
  connection.query(query,[id], (err, results) => {
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
   "SELECT *,  (SELECT SUM(recette-depense) FROM transaction WHERE date_transaction <= t.date_transaction and id<=t.id) AS solde FROM transaction AS t where t.date_transaction=? ORDER BY date_transaction ASC ;";
  connection.query(query, [date.date], (err, results) => {
    if (!err) {
      return res.status(200).json(results );
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.post("/get/solde/date", (req, res, next) => {
  let date = req.body;
  let query =
   " SELECT SUM(recette-depense) as totalSolde FROM transaction WHERE date_transaction <= ?;";
  connection.query(query, [date.date], (err, results) => {
    if (!err) {
      return res.status(200).json(results );
    } else {
      return res.status(500).json({ err });
    }
  });
});

router.patch("/update", auth.authenticate , (req, res, next) => {
  let transaction = req.body;
  let query =
    "update transaction set libelle=?, recette=? , depense=? where id=?";
  connection.query(
    query,
    [
      transaction.libelle,
      transaction.recette,
      transaction.depense,
      transaction.id,
    ],
    (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "transaction ID not found" });
        }
        return res
          .status(200)
          .json({ message: "transaction updated successfully" });
      } else {
        return res.status(500).json({ err });
      }
    }
  );
});

router.delete(
  "/delete/:id",
  auth.authenticate,
  role.checkRole,
  (req, res, next) => {
    const id = req.params.id;
    let query = "delete from transaction where id=?";
    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "transaction ID not found" });
        }
        return res
          .status(200)
          .json({ message: "transaction deleted successfully" });
      } else {
        return res.status(500).json({ err });
      }
    });
  }
);

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './uploads/')
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    )
  },
})
var upload = multer({
  storage: storage,
})

router.post("/transaction/uploadcsv", upload.single('import-csv'), (req, res) => {
  csvToDb(__dirname + '/uploads/' + req.file.filename)
  res.json({
    msg: 'File successfully inserted!',
    file: req.file,
  })
})
function csvToDb(csvUrl) {
  let stream = fs.createReadStream(csvUrl)
  let collectionCsv = []
  let csvFileStream = csv
    .parse()
    .on('data', function (data) {
      collectionCsv.push(data)
    })
    .on('end', function () {
      collectionCsv.shift()
      db.connect((error) => {
        if (error) {
        } else {
          let query = 'insert into transaction (libelle, date_transaction, recette, depense,userID) values(?,?,?,?,?)'
          db.query(query, [collectionCsv], (error, res) => {
          })
        }
      })
      fs.unlinkSync(csvUrl)
    })
  stream.pipe(csvFileStream)
}

module.exports = router;
