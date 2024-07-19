const express = require("express");
const cors = require("cors");
const body_parser = require("body-parser");
const connectToDatabase = require("./db");
const { fetchApi } = require("./utils/fetchPlantApi");
const { userStationList } = require("./utils/API");
const Plant = require("./models/energyGenerationSchema");
const app = express();
require("dotenv").config({ path: ".env" });
const schedule = require("node-schedule");

app.use(cors());
app.use(express.json());
app.use(body_parser.urlencoded({ extended: true }));

connectToDatabase();

async function run() {
  try {
    // console.log("wait fetching api");
    const res = await fetchApi(userStationList);
    let data = res?.page?.records;
    if (data) {
      // console.log("Data got from api");
      // console.log("Data size is ", data?.length);
      for (let e of data) {
        await Plant.create({
          timeStamp: e?.dataTimestampStr,
          energyGeneration: e?.dayEnergy,
          powerGeneration: e?.power,
        });
        // console.log("Document created ");
      }
    } else {
      // console.log("Error: data not found from api");
    }
  } catch (error) {
    console.log(
      "Error :",
      error?.message ? error?.message : error?.response?.data?.message
    );
  }
}

// setInterval(() => {
//   run();
// }, 10000);

let job1 = null;

const job2 = schedule.scheduleJob("0 40 13 * * *", function () {
  if (job1) {
    console.log("Fetching plant data job has already been started");
  } else {
    console.log("Fetching plant data job has been started");
    job1 = schedule.scheduleJob("*/5 * * * *", function () {
      run();
    });
  }
});

const job3 = schedule.scheduleJob("0 5 18 * * *", function () {
  if (job1) {
    job1.cancel();
    job1 = null;
    console.log("Fetching plant data job has been cancelled");
  } else {
    console.log("Fetching plant data job has not been started yet");
  }
});

app.get("/data", async (req, res) => {
  res.status(200).json({ message: "Getting response", sucess: true });
});

const server = app.listen(4000, (res, err) => {
  console.log("Server is running at port " + server.address().port);
});
