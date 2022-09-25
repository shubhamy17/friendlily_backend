const express = require("express");
const constants = require("./private_constants");
const mongoose = require("mongoose");
const app = express();


mongoose.connect(constants.mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});
mongoose.connection.on("error", (err) => {
  console.log("connecteding error", err);
});
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
