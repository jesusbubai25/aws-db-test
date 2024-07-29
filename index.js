const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const body_parser = require("body-parser");
const { fetchApi } = require("./utils/fetchPlantApi");
const { userStationList } = require("./utils/API");
const Plant = require("./models/energyGenerationSchema");
const app = express();
require("dotenv").config({ path: ".env" });
const schedule = require("node-schedule");
const { connectToDatabase, connectToDatabase2 } = require("./db");

app.use(cors());
app.use(express.json());
app.use(body_parser.urlencoded({ extended: true }));

connectToDatabase2();

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
        console.log("Document created ");
      }
    } else {
      console.log("Error: data not found from api");
    }
  } catch (error) {
    console.log(
      "Error :",
      error?.message ? error?.message : error?.response?.data?.message
    );
  }
}
async function update() {
  let document = await Plant.findById("66a7c0e95c9bc3490b06d52a");
  console.log("Document is ", document);
  document = await Plant.findByIdAndDelete("66a7c0e95c9bc3490b06d52a");
  return document;
}

update()
  .then((res) => console.log("document deleted\n ", res))
  .catch((err) => console.log("Error : ", err?.message));

// setInterval(() => {
//   run();
// }, 60000);

// const rule1 = new schedule.RecurrenceRule();
// const rule2 = new schedule.RecurrenceRule();
// rule1.tz = "Etc/UTC";
// rule2.tz = "Etc/UTC";
// rule1.hour = 1;
// rule1.minute = 25;

// rule2.hour = 13;
// rule2.minute = 5;

// let job1 = null;

// schedule.scheduleJob(rule1, function () {
//   if (job1) {
//     console.log("Fetching plant data job has already been started");
//   } else {
//     console.log("Fetching plant data job has been started");
//     job1 = schedule.scheduleJob("*/5 * * * *", function () {
//       run();
//     });
//   }
// });

// schedule.scheduleJob(rule2, function () {
//   if (job1) {
//     job1.cancel();
//     job1 = null;
//     console.log("Fetching plant data job has been cancelled");
//   } else {
//     console.log("Fetching plant data job has not been started yet");
//   }
// });

app.get("/data", async (req, res) => {
  res.status(200).json({ message: "Getting response", sucess: true });
});

const server = app.listen(4000, (res, err) => {
  console.log("Server is running at port " + server.address().port);
});
