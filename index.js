const express = require("express");
const cors = require("cors");
const body_parser = require("body-parser");
const connectToDatabase = require("./db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(body_parser.urlencoded({ extended: true }));

connectToDatabase();

app.get("/data", async (req, res) => {
  res.status(200).json({ message: "Getting response", sucess: true });
});

const server = app.listen(4000, (res, err) => {
  console.log("Server is running at port " + server.address().port);
});
