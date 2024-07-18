const mongoose = require("mongoose");

const connectToDatabase = () => {
  mongoose
    .connect("mongodb://localhost:27017/plantDatabase")
    .then((res) => console.log("Connected to Database"))
    .catch((err) =>
      console.log(
        "Error occured during connection to database \nError is :",
        err?.message
      )
    );
};

module.exports = connectToDatabase;
