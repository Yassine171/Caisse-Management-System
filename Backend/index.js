const express = require("express");
const cors = require("cors");
const connection = require("./connection");
const userRoute = require("./routes/user");
const transactionRoute = require("./routes/transaction");
const billRoute = require("./routes/bill");
const dashboardRoute = require("./routes/dashboard");
const bodyparser = require('body-parser')

const app = express();

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use("/user", userRoute);
app.use("/transaction", transactionRoute);
app.use("/bill", billRoute);
app.use("/dashboard", dashboardRoute);

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))

module.exports = app;
