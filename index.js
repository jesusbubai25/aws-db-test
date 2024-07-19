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
    console.log("wait fetching api");
    const res = await fetchApi(userStationList);
    let data = res?.page?.records;
    if (data) {
      console.log("Data got from api");
      console.log("Data size is ", data?.length);
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

// setInterval(() => {
//   // run();
//   console.log("inside timeout")
// // }, 10000);
// schedule.scheduleJob("*/10 * * * * *",  ()=>{
//   console.log("inside shedule job ",new Date())
// })

const rule1 = new schedule.RecurrenceRule();
const rule2 = new schedule.RecurrenceRule();
rule1.tz = 'Etc/UTC';
rule2.tz='Etc/UTC'
rule1.minute=59
rule1.hour=19;
rule2.minute=5;
rule2.hour=20;


let job1 = null;

schedule.scheduleJob(rule1, function () {
  if (job1) {
    console.log("Fetching plant data job has already been started");
  } else {
    console.log("Fetching plant data job has been started");
    job1 = schedule.scheduleJob("*/1 * * * *", function () {
      console.log("invoking run!")
      // run();
    });
  }
});

schedule.scheduleJob(rule2, function () {
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
