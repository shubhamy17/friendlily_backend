const constants = require("./private_constants");
const mongoose = require("mongoose");
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