const express = require("express");
const constants = require("./private_constants");
const db =require("./db");
const app = express();


app.use(express.json());

const AuthRouter = require("./Controller/auth");

app.use("/auth", AuthRouter);

app.get("/", (req, res) => {
  res.send({
    sttaus: 200,
    message: "Welcome to friendlily",
  });
});

app.listen(constants.PORT, () => {
  console.log(`Listening on port 3000`);
});
