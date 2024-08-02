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
        console.log(`Document created\nDate And Time is ${getLocalDateTime()}`);
      }
    } else {
      console.log(`Error: data not found from api\nDate And Time is ${getLocalDateTime()}`);
    }
  } catch (error) {
    console.log(
      "Error :",
      error?.message ? error?.message : error?.response?.data?.message
    );
  }
}

function getLocalDateTime() {
  let date = new Date();
  let dateStr = date
    .toLocaleDateString()
    ?.split("/")
    ?.map((e) => e.padStart(2, "0"))
    .join("/");
  return dateStr + " " + date.toLocaleTimeString();
}

// setInterval(() => {
//   run();
// }, 10000);

const rule1 = new schedule.RecurrenceRule();
const rule2 = new schedule.RecurrenceRule();
rule1.tz = "Etc/UTC";
rule2.tz = "Etc/UTC";
rule1.hour = 0;
rule1.minute = 20;

rule2.hour = 13;
rule2.minute = 0;

let job1 = null;

schedule.scheduleJob(rule1, function () {
  if (job1) {
    console.log(
      `Fetching plant data job has already been started\nDate And Time is ${getLocalDateTime()}`
    );
  } else {
    console.log(
      `Fetching plant data job has been started\nDate And Time is ${getLocalDateTime()}`
    );
    job1 = schedule.scheduleJob("*/5 * * * *", function () {
      run();
    });
  }
});

schedule.scheduleJob(rule2, function () {
  if (job1) {
    job1.cancel();
    job1 = null;
    console.log(
      `Fetching plant data job has been cancelled\nDate And Time is ${getLocalDateTime()}`
    );
  } else {
    console.log(
      `Fetching plant data job has not been started yet\nDate And Time is ${getLocalDateTime()}`
    );
  }
});

app.get("/data", async (req, res) => {
  res.status(200).json({ message: "Getting response", sucess: true });
});

const server = app.listen(4000, (res, err) => {
  console.log("Server is running at port " + server.address().port);
});
