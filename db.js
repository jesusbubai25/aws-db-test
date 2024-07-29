const mongoose = require("mongoose");

module.exports.connectToDatabase = () => {
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

module.exports.connectToDatabase2 = () => {
  mongoose
    .connect(
      "mongodb://sidh1234:sidh1234@docdb-cluster-01.cluster-crgmmsg0es4i.ap-south-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
    )
    .then((res) =>
      console.log(
        "Connected to database successfully! \nHost is ",
        res.connection.host
      )
    )
    .catch((err) => console.log("Error:", err?.message));
};

