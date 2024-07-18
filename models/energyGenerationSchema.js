const mongoose = require("mongoose");
mongoose.pluralize(null);

const energyGeneration = new mongoose.Schema({
  timeStamp: {
    type: String,
    require: true,
  },
  cretedAt: {
    type: Date,
    default: Date.now,
  },
  energyGeneration: {
    type: Number,
    require: true,
  },
  powerGeneration: {
    type: Number,
    require: true,
  },
  powerGenerationStr: {
    type: String,
    default: "kW",
  },
  energyGenerationStr: {
    type: String,
    default: "kWh",
  },
});

module.exports = mongoose.model("energyAndPowerGen", energyGeneration);
